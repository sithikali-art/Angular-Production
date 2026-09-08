import { Injectable, computed, inject, signal } from '@angular/core';

import { PaymentsApiService } from '../services/payments-api.service';
import { DraftPayment, DraftPaymentType } from '../models';

export type DraftsTab = 'All' | DraftPaymentType;

export const DRAFT_TABS: DraftsTab[] = [
  'All',
  'Simple Pay',
  'Advanced Pay',
  'Mass Pay',
  'Bill Pay',
  'Transfer',
  'Exchange',
  'Fund Wallet',
];

@Injectable({ providedIn: 'root' })
export class DraftsStateService {
  private readonly api = inject(PaymentsApiService);

  readonly drafts = signal<DraftPayment[]>([]);
  readonly activeTab = signal<DraftsTab>('All');
  readonly onlyMine = signal(false);
  readonly expandedId = signal<string | null>(null);

  readonly filtered = computed(() => {
    const tab = this.activeTab();
    const mine = this.onlyMine();
    return this.drafts()
      .filter((d) => (tab === 'All' ? true : d.type === tab))
      .filter((d) => (mine ? d.isMine : true));
  });

  readonly count = computed(() => this.drafts().length);

  load(): void {
    if (this.drafts().length > 0) {
      return;
    }
    this.api.getDrafts().subscribe((drafts) => this.drafts.set(drafts));
  }

  setTab(tab: DraftsTab): void {
    this.activeTab.set(tab);
  }

  toggleOnlyMine(): void {
    this.onlyMine.update((v) => !v);
  }

  toggleDetails(id: string): void {
    this.expandedId.update((current) => (current === id ? null : id));
  }

  delete(id: string): void {
    this.api.deleteDraft(id).subscribe(() => {
      this.drafts.update((list) => list.filter((d) => d.id !== id));
    });
  }
}
