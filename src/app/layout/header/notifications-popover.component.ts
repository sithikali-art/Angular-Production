import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AlertKind } from '../../core/models';
import { NotificationsStateService } from '../../core/state/notifications-state.service';
import { IconComponent } from '../../shared/ui/icon/icon.component';

const KIND_ICON: Record<AlertKind, string> = {
  plan: 'mail',
  approval: 'user',
  gift: 'gift',
  access: 'user',
  security: 'shield',
};

/** Image 5 — "New Alerts" dropdown under the bell icon. */
@Component({
  selector: 'app-notifications-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, IconComponent],
  templateUrl: './notifications-popover.component.html',
  styleUrl: './notifications-popover.component.scss',
})
export class NotificationsPopoverComponent {
  readonly notifications = inject(NotificationsStateService);

  iconFor(kind: AlertKind): string {
    return KIND_ICON[kind];
  }
}
