import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  MOCK_PREVIOUS_SEARCHES,
  MOCK_SEARCH_DIRECTORY,
  MOCK_SUGGESTED_SEARCHES,
} from '../../core/mock/mock-data';
import { SearchDirectoryEntry } from '../../core/models';
import { DraftsStateService } from '../../core/state/drafts-state.service';
import { LayoutUiStateService } from '../../core/state/layout-ui-state.service';
import { NotificationsStateService } from '../../core/state/notifications-state.service';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { AppearancePopoverComponent } from './appearance-popover.component';
import { NotificationsPopoverComponent } from './notifications-popover.component';

/**
 * Top header: global search (with companies/individuals dropdown),
 * upgrade CTA and the utility cluster (appearance, drafts,
 * notifications, profile). The profile chip navigates to /profile.
 */
@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ClickOutsideDirective,
    IconComponent,
    AvatarComponent,
    AppearancePopoverComponent,
    NotificationsPopoverComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly layoutUi = inject(LayoutUiStateService);
  readonly drafts = inject(DraftsStateService);
  readonly notifications = inject(NotificationsStateService);

  readonly searchQuery = signal('');
  readonly suggestedSearches = MOCK_SUGGESTED_SEARCHES;
  readonly previousSearches = MOCK_PREVIOUS_SEARCHES;

  /** Directory entries filtered by the current query (top 6). */
  readonly searchResults = computed<SearchDirectoryEntry[]>(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return MOCK_SEARCH_DIRECTORY.filter(
      (e) => q === '' || e.name.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q),
    ).slice(0, 6);
  });

  constructor() {
    // Eager-load so the drafts badge count is right on first paint.
    this.drafts.load();
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.layoutUi.open('search');
  }

  onSearchFocus(): void {
    this.layoutUi.open('search');
  }

  applySearch(term: string): void {
    this.searchQuery.set(term);
  }

  selectResult(entry: SearchDirectoryEntry): void {
    this.searchQuery.set(entry.name);
    this.layoutUi.close('search');
  }

  openDrafts(): void {
    this.layoutUi.toggle('drafts');
  }
}
