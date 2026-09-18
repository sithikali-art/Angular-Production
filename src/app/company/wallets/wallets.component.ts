import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { WalletStateService } from '../../core/state/wallet-state.service';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { FlagIconComponent } from '../../shared/components/flag-icon/flag-icon.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { FancySpinnerComponent } from '../../shared/components/fancy-spinner/fancy-spinner.component';

/** /wallets — grid of wallet cards (demonstrates active-route highlighting). */
@Component({
  selector: 'app-wallets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe, FlagIconComponent, IconComponent, SearchInputComponent, FancySpinnerComponent],
  templateUrl: './wallets.component.html',
  styleUrl: './wallets.component.scss',
})
export class WalletsComponent {
  readonly wallet = inject(WalletStateService);

  // 1. Temporary signal for visual testing
  readonly forceLoader = signal<boolean>(true);

  constructor() {
    // 2. Delay loading by 4 seconds so you can visually inspect the spinner
    setTimeout(() => {
      this.forceLoader.set(false);
    this.wallet.load();
    }, 3000);
  }
  // 3. Declare the missing searchQuery signal
  readonly searchQuery = signal<string>('');
}
