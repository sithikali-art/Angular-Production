import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LayoutUiStateService } from '../../../core/state/layout-ui-state.service';
import { WalletStateService } from '../../../core/state/wallet-state.service';
import { MoneyPipe } from '../../pipes/money.pipe';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { FlagIconComponent } from '../../ui/flag-icon/flag-icon.component';
import { IconComponent } from '../../ui/icon/icon.component';

/**
 * Image 9 — the currency dropdown inside the Wallet Balance card.
 * Switching a wallet re-queries activity + transactions via the store.
 */
@Component({
  selector: 'app-wallet-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe, ClickOutsideDirective, FlagIconComponent, IconComponent],
  templateUrl: './wallet-selector.component.html',
  styleUrl: './wallet-selector.component.scss',
})
export class WalletSelectorComponent {
  readonly wallet = inject(WalletStateService);
  readonly layoutUi = inject(LayoutUiStateService);

  select(walletId: number): void {
    this.wallet.selectWallet(walletId);
    this.layoutUi.close('wallet-selector');
  }

  /** Bottom of the dropdown: open the Wallet Details drawer. */
  openDetails(): void {
    this.layoutUi.open('wallet-details');
  }
}
