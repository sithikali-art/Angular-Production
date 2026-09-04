import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DRAFT_TABS, DraftsStateService } from '../../../core/state/drafts-state.service';
import { LayoutUiStateService } from '../../../core/state/layout-ui-state.service';
import { DrawerComponent } from '../../../shared/ui/drawer/drawer.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { ToggleSwitchComponent } from '../../../shared/ui/toggle-switch/toggle-switch.component';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';

/**
 * Image 4 — "Draft payments" slide-over: type-filter chips, a
 * "created by me" toggle and the resumable draft cards.
 */
@Component({
  selector: 'app-drafts-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DrawerComponent, IconComponent, ToggleSwitchComponent, NgClass, ModalComponent],
  templateUrl: './drafts-drawer.component.html',
  styleUrl: './drafts-drawer.component.scss',
})
export class DraftsDrawerComponent {
  readonly drafts = inject(DraftsStateService);
  readonly layoutUi = inject(LayoutUiStateService);
  readonly tabs = DRAFT_TABS;

  deleteModal = false;
  selectedDraftId: string | null = null;

  

  viewDraft:string="View all draft";
  viewAllDrafts=false;
  
  deleteDraft(id: string): void {
    console.log("Delete");
    this.selectedDraftId = id;
    this.deleteModal = true;
  }

  cancelDelete(): void {
    this.deleteModal = false;
    this.selectedDraftId = null;
  }

  confirmDelete(): void {
    if (this.selectedDraftId === null) {
      return;
    }

    this.drafts.delete(String(this.selectedDraftId));

    this.deleteModal = false;
    this.selectedDraftId = null;
  }

  viewAllDraftExpand() {
    this.viewAllDrafts = !this.viewAllDrafts;
  this.viewDraft = this.viewAllDrafts ? 'Show less' : 'View all drafts';
    console.log(this.viewAllDrafts);
  }
}
