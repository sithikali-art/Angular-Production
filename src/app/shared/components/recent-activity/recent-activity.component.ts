import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { WalletStateService } from '../../../core/state/wallet-state.service';
import { MoneyPipe } from '../../pipes/money.pipe';
import { IconComponent } from '../../ui/icon/icon.component';

/** "Recent activity" list next to the balance card. */
@Component({
  selector: 'app-recent-activity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MoneyPipe, IconComponent],
  templateUrl: './recent-activity.component.html',
  styleUrl: './recent-activity.component.scss',
})
export class RecentActivityComponent {
  readonly wallet = inject(WalletStateService);
}
