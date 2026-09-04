import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FundingMethod } from '../../../core/models';
import { LayoutUiStateService } from '../../../core/state/layout-ui-state.service';
import { WalletStateService } from '../../../core/state/wallet-state.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { IconComponent } from '../../ui/icon/icon.component';

/**
 * Image 10 — the lavender funding strip: bank account selector,
 * funding method selector, maskable account number and routing.
 */
@Component({
  selector: 'app-funding-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClickOutsideDirective, IconComponent],
  templateUrl: './funding-bar.component.html',
  styleUrl: './funding-bar.component.scss',
})
export class FundingBarComponent {
  readonly wallet = inject(WalletStateService);
  readonly layoutUi = inject(LayoutUiStateService);

  selectAccount(id: string): void {
    this.wallet.selectFundingAccount(id);
    this.layoutUi.close('funding-selector');
  }

  selectMethod(method: FundingMethod): void {
    this.wallet.fundingMethod.set(method);
    this.layoutUi.close('funding-method');
  }
}
