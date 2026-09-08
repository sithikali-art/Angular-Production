import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { DraftsStateService } from '../../core/state/drafts-state.service';
import { LayoutUiStateService } from '../../core/state/layout-ui-state.service';
import { NotificationsStateService } from '../../core/state/notifications-state.service';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { AppearancePopoverComponent } from '../header/appearance-popover.component';
import { NotificationsPopoverComponent } from '../header/notifications-popover.component';

interface NavChild {
  label: string;
  path: string;
}

interface NavItem {
  label: string;
  icon: string;
  path?: string;
  exact?: boolean;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: 'home', path: '/', exact: true },
  { label: 'Wallets', icon: 'wallet', path: '/wallets' },
  {
    label: 'Fund',
    icon: 'arrow-down-right',
    children: [
      { label: 'Fund Wallet', path: '/fund/wallet' },
      { label: 'Funding Options', path: '/fund/options' },
    ],
  },
  {
    label: 'Pay',
    icon: 'arrow-right',
    children: [
      { label: 'Simple Pay', path: '/pay/simple' },
      { label: 'Advanced Pay', path: '/pay/advanced' },
      { label: 'Mass Pay', path: '/pay/mass' },
      { label: 'API Payments', path: '/pay/api' },
      { label: 'Bill Pay', path: '/pay/bills' },
    ],
  },
  { label: 'Move', icon: 'arrow-back', path: '/move' },
  { label: 'Transfer', icon: 'arrow-up-right', path: '/transfer' },
  { label: 'Exchange', icon: 'arrows-left-right', path: '/exchange' },
  { label: 'Requests', icon: 'shield-check', path: '/requests' },
  { label: 'Activity', icon: 'list-details', path: '/activity' },
  { label: 'Analytics', icon: 'chart', path: '/analytics' },
  { label: 'Reports', icon: 'file-text', path: '/reports' },
  { label: 'Contacts', icon: 'affiliate', path: '/contacts' },
  { label: 'Settings', icon: 'settings', path: '/settings' },
];

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    IconComponent,
    AvatarComponent,
    ClickOutsideDirective,
    AppearancePopoverComponent,
    NotificationsPopoverComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly router = inject(Router);
  readonly layoutUi = inject(LayoutUiStateService);
  readonly drafts = inject(DraftsStateService);
  readonly notifications = inject(NotificationsStateService);

  readonly items = NAV_ITEMS;

  /**
   * A group is expanded when the user toggled it OR when one of its
   * children is the active route (so a deep link into /fund/wallet
   * opens the Fund accordion automatically).
   */
  readonly openGroup = computed(() => {
    const manual = this.layoutUi.expandedNavGroup();
    if (manual !== null) {
      return manual;
    }
    const url = this.router.url;
    return this.items.find((i) => i.children?.some((c) => url.startsWith(c.path)))?.label ?? null;
  });

  isGroupActive(item: NavItem): boolean {
    return item.children?.some((c) => this.router.url.startsWith(c.path)) ?? false;
  }

  toggleGroup(label: string): void {
    // Explicit toggle wins over the route-derived default.
    this.layoutUi.expandedNavGroup.update((current) =>
      current === label ? '' : label,
    );
  }

  /** Navigating from the mobile overlay dismisses it. */
  closeMobile(): void {
    this.layoutUi.mobileNavOpen.set(false);
  }

  openDrafts(): void {
    this.closeMobile();
    this.layoutUi.open('drafts');
  }
}
