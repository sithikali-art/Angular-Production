import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MOCK_COMPANY } from '../../core/mock/mock-data';
import { ApprovalsStateService } from '../../core/state/approvals-state.service';
import { LayoutUiStateService } from '../../core/state/layout-ui-state.service';
import { WalletStateService } from '../../core/state/wallet-state.service';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { ActivityChartComponent } from '../../shared/components/activity-chart/activity-chart.component';
import { FundingBarComponent } from '../../shared/components/funding-bar/funding-bar.component';
import { RecentActivityComponent } from '../../shared/components/recent-activity/recent-activity.component';
import { StatusPopoverComponent } from '../../shared/components/status-popover/status-popover.component';
import { WalletBalanceCardComponent } from '../../shared/components/wallet-balance-card/wallet-balance-card.component';

/**
 * Image 1 — Home / dashboard overview. Composes the page header
 * (company + status + approvals CTA), balance hero, recent activity,
 * funding strip and the activity chart.
 */
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconComponent,
    StatusPopoverComponent,
    WalletBalanceCardComponent,
    RecentActivityComponent,
    FundingBarComponent,
    ActivityChartComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly wallet = inject(WalletStateService);
  readonly approvals = inject(ApprovalsStateService);
  readonly layoutUi = inject(LayoutUiStateService);

  readonly company = MOCK_COMPANY;

  constructor() {
    this.wallet.load();
    this.approvals.load();
  }

  openApprovals(): void {
    this.layoutUi.open('approvals');
  }
}
