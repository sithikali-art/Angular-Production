import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { WalletStateService } from '../../core/state/wallet-state.service';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { FlagIconComponent } from '../../shared/ui/flag-icon/flag-icon.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/** /wallets — grid of wallet cards (demonstrates active-route highlighting). */
@Component({
  selector: 'app-wallets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe, FlagIconComponent, IconComponent],
  templateUrl: './wallets.component.html',
  styleUrl: './wallets.component.scss',
})
export class WalletsComponent {
  readonly wallet = inject(WalletStateService);

  constructor() {
    this.wallet.load();
  }
}
