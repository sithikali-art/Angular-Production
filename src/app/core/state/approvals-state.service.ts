import { Injectable, computed, inject, signal } from '@angular/core';

import { ApprovalsApiService } from '../services/approvals-api.service';
import { ApprovalItem, ApprovalType } from '../models';

export type ApprovalsTab = 'All' | ApprovalType;

@Injectable({ providedIn: 'root' })
export class ApprovalsStateService {
  private readonly api = inject(ApprovalsApiService);

  readonly approvals = signal<ApprovalItem[]>([]);
  readonly activeTab = signal<ApprovalsTab>('All');
  /** "Show only items assigned to me" toggle. */
  readonly onlyMine = signal(false);
  /** Id of the item currently showing the inline "Approve this request?" confirm. */
  readonly confirmingId = signal<string | null>(null);
  readonly busyId = signal<string | null>(null);
  /** Id of the item whose "View details" panel is expanded. */
  readonly expandedId = signal<string | null>(null);

  readonly tabs = computed<ApprovalsTab[]>(() => {
    const present = new Set(this.approvals().map((a) => a.type));
    return ['All', ...(['Mass Pay', 'Bank Transfer', 'Wallet', 'Advanced Pay'] as const).filter((t) => present.has(t))];
  });

  readonly filtered = computed(() => {
    const tab = this.activeTab();
    const mine = this.onlyMine();
    return this.approvals()
      .filter((a) => a.status === 'Pending')
      .filter((a) => (tab === 'All' ? true : a.type === tab))
      .filter((a) => (mine ? a.assignedToMe : true));
  });

  toggleOnlyMine(): void {
    this.onlyMine.update((v) => !v);
  }

  readonly pendingCount = computed(
    () => this.approvals().filter((a) => a.status === 'Pending').length,
  );

  load(): void {
    if (this.approvals().length > 0) {
      return;
    }
    this.api.getPending().subscribe((items) => this.approvals.set(items));
  }

  setTab(tab: ApprovalsTab): void {
    this.activeTab.set(tab);
    this.confirmingId.set(null);
    this.expandedId.set(null);
  }

  toggleDetails(id: string): void {
    this.expandedId.update((current) => (current === id ? null : id));
  }

  /** First click on "Approve" only arms the inline confirmation. */
  requestApprove(id: string): void {
    this.confirmingId.set(id);
  }

  cancelConfirm(): void {
    this.confirmingId.set(null);
  }

  confirmApprove(id: string): void {
    this.busyId.set(id);
    this.api.approve(id).subscribe((updated) => {
      this.approvals.update((list) => list.map((a) => (a.id === id ? updated : a)));
      this.confirmingId.set(null);
      this.busyId.set(null);
    });
  }

  decline(id: string): void {
    this.busyId.set(id);
    this.api.decline(id).subscribe((updated) => {
      this.approvals.update((list) => list.map((a) => (a.id === id ? updated : a)));
      this.confirmingId.set(null);
      this.busyId.set(null);
    });
  }
}
