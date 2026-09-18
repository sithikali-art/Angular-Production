import { Injectable, computed, signal } from '@angular/core';

import { AlertNotification } from '../models';
import { MOCK_ALERTS } from '../mock/mock-data';

@Injectable({ providedIn: 'root' })
export class NotificationsStateService {
  readonly alerts = signal<AlertNotification[]>(MOCK_ALERTS);

  readonly unreadCount = computed(() => this.alerts().filter((a) => !a.isRead).length);

  markAllRead(): void {
    this.alerts.update((list) => list.map((a) => ({ ...a, isRead: true })));
  }
}
