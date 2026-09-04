import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LayoutUiStateService } from '../../../core/state/layout-ui-state.service';
import { WalletStateService } from '../../../core/state/wallet-state.service';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';
import { DrawerComponent } from '../../../shared/ui/drawer/drawer.component';
import { FlagIconComponent } from '../../../shared/ui/flag-icon/flag-icon.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

/**
 * "Wallet details" slide-over — wallet information and the funding
 * bank summary for the selected currency, with per-field copy actions
 * and a "Copy all details" footer button.
 */
@Component({
  selector: 'app-wallet-details-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe, DrawerComponent, FlagIconComponent, IconComponent],
  templateUrl: './wallet-details-drawer.component.html',
  styleUrl: './wallet-details-drawer.component.scss',
})
export class WalletDetailsDrawerComponent {
  readonly wallet = inject(WalletStateService);
  readonly layoutUi = inject(LayoutUiStateService);

  copy(value: string): void {
    void navigator.clipboard?.writeText(value);
  }

  copyBankSummary(): void {
    const bank = this.wallet.selectedWallet()?.fundBank;
    if (bank) {
      this.copy(
        `Bank name: ${bank.bankName}\nAccount no.: ${bank.accountNo}\nSWIFT: ${bank.swift}\nWire ABA: ${bank.wireAba}\nBeneficiary: ${bank.beneficiary}`,
      );
    }
  }

  copyAllDetails(): void {
    const selected = this.wallet.selectedWallet();
    if (!selected) {
      return;
    }
    this.copy(
      [
        `Wallet: ${selected.currency} • ${selected.name}`,
        `Wallet ID: ${selected.walletId}`,
        `Balance: ${selected.balance}`,
        `Currency: ${selected.currency}`,
        `Entity: ${selected.entity}`,
        `Wallet type: ${selected.walletType}`,
        `Bank name: ${selected.fundBank.bankName}`,
        `Account no.: ${selected.fundBank.accountNo}`,
        `SWIFT: ${selected.fundBank.swift}`,
        `Wire ABA: ${selected.fundBank.wireAba}`,
        `Beneficiary: ${selected.fundBank.beneficiary}`,
      ].join('\n'),
    );
  }
}
