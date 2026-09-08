import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MOCK_COMPANY } from '../../../core/mock/mock-data';
import { LayoutUiStateService } from '../../../core/state/layout-ui-state.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { IconComponent } from '../../ui/icon/icon.component';

/**
 * "Company status" popover on the Status badge — opens on hover or
 * click and lists identity level, payment approvals and connected
 * services with their current state.
 */
@Component({
  selector: 'app-status-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClickOutsideDirective, IconComponent],
  templateUrl: './status-popover.component.html',
  styleUrl: './status-popover.component.scss',
})
export class StatusPopoverComponent {
  readonly layoutUi = inject(LayoutUiStateService);
  readonly company = MOCK_COMPANY;

  open(): void {
    this.layoutUi.open('status');
  }

  close(): void {
    this.layoutUi.close('status');
  }
}
