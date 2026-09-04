import { ChangeDetectionStrategy, Component, inject, effect } from '@angular/core';

import { WalletStateService } from '../../../core/state/wallet-state.service';
import { MoneyPipe } from '../../pipes/money.pipe';
import { WalletSelectorComponent } from '../wallet-selector/wallet-selector.component';

/**
 * The gradient "Wallet Balance" hero card. The wireframe globe fills
 * the card background and rotates each time a different wallet is
 * selected; the Wallet Details drawer opens from the wallet dropdown.
 */
@Component({
  selector: 'app-wallet-balance-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe, WalletSelectorComponent],
  templateUrl: './wallet-balance-card.component.html',
  styleUrl: './wallet-balance-card.component.scss',
})
export class WalletBalanceCardComponent {
  readonly wallet = inject(WalletStateService);

  spin = 0;
   private previousWalletId: number | undefined;

  private readonly rotateGlobe = effect(() => {
    const selectedWallet = this.wallet.selectedWallet();

    if (!selectedWallet) {
      return;
    }

    if (this.previousWalletId === undefined) {
      this.previousWalletId = selectedWallet.walletId;
      return;
    }

    if (this.previousWalletId !== selectedWallet.walletId) {
      this.previousWalletId = selectedWallet.walletId;
      this.spin += 60;
    }
  });
}
