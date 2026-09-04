import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ApprovalsStateService } from '../../../core/state/approvals-state.service';
import { LayoutUiStateService } from '../../../core/state/layout-ui-state.service';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';
import { DrawerComponent } from '../../../shared/ui/drawer/drawer.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { ToggleSwitchComponent } from '../../../shared/ui/toggle-switch/toggle-switch.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';

/**
 * Images 7 & 8 — "Approvals Outstanding" slide-over with tab filtering
 * and a two-step inline approval: clicking "Approve" swaps the card's
 * action row for a "Approve this request? Confirm / Cancel" strip.
 */
@Component({
  selector: 'app-approvals-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MoneyPipe, DrawerComponent, IconComponent, ToggleSwitchComponent, ButtonComponent, BadgeComponent],
  templateUrl: './approvals-drawer.component.html',
  styleUrl: './approvals-drawer.component.scss',
})
export class ApprovalsDrawerComponent {
  readonly approvals = inject(ApprovalsStateService);
  readonly layoutUi = inject(LayoutUiStateService);
}
