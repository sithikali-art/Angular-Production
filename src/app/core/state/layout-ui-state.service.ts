import { Injectable, computed, signal } from '@angular/core';

/**
 * Every floating surface in the app. Keeping them in one union means
 * only one overlay can ever be open — opening the notifications
 * dropdown automatically closes the appearance popover, etc.
 */
export type OverlayId =
  | 'appearance'
  | 'drafts'
  | 'notifications'
  | 'status'
  | 'approvals'
  | 'wallet-selector'
  | 'wallet-details'
  | 'funding-selector'
  | 'funding-method'
  | 'search'
  | 'profile';

@Injectable({ providedIn: 'root' })
export class LayoutUiStateService {
  private readonly activeOverlay = signal<OverlayId | null>(null);

  /** Sidebar accordion — label of the currently expanded group. */
  readonly expandedNavGroup = signal<string | null>(null);

  /** Mobile drawer visibility for the sidebar. */
  readonly mobileNavOpen = signal(false);

  readonly hasOpenDrawer = computed(
    () => this.activeOverlay() === 'drafts' || this.activeOverlay() === 'approvals',
  );

  isOpen(id: OverlayId): boolean {
    return this.activeOverlay() === id;
  }

  /** Reactive read for templates: layoutUi.overlay() === 'drafts'. */
  readonly overlay = this.activeOverlay.asReadonly();

  open(id: OverlayId): void {
    this.activeOverlay.set(id);
  }

  close(id?: OverlayId): void {
    if (!id || this.activeOverlay() === id) {
      this.activeOverlay.set(null);
    }
  }

  toggle(id: OverlayId): void {
    this.activeOverlay.update((current) => (current === id ? null : id));
  }

  toggleNavGroup(label: string): void {
    this.expandedNavGroup.update((current) => (current === label ? null : label));
  }
}
