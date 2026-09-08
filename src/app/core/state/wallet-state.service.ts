import { Injectable, computed, inject, signal } from '@angular/core';

import { WalletApiService } from '../services/wallet-api.service';
import {
  FundingBankAccount,
  FundingMethod,
  Wallet,
  WalletActivitySummary,
  WalletTransaction,
} from '../models';

export type ChartKind = 'line' | 'bar';
export type ChartRange = 'year' | 'month' | 'day';

/**
 * Signals-based store for everything wallet-related on the dashboard:
 * the wallet list + selection, funding bank account + method, recent
 * activity and the chart controls.
 */
@Injectable({ providedIn: 'root' })
export class WalletStateService {
  private readonly api = inject(WalletApiService);

  // --- Wallets -----------------------------------------------------
  readonly wallets = signal<Wallet[]>([]);
  readonly selectedWalletId = signal<number | null>(null);
  /** Accumulated rotation of the balance-card globe; +120° per wallet switch. */
  readonly globeAngle = signal(0);
  readonly selectedWallet = computed<Wallet | null>(() => {
    const id = this.selectedWalletId();
    return this.wallets().find((w) => w.walletId === id) ?? this.wallets()[0] ?? null;
  });

  // --- Funding bar -------------------------------------------------
  readonly fundingAccounts = signal<FundingBankAccount[]>([]);
  readonly selectedFundingAccountId = signal<string | null>(null);
  readonly selectedFundingAccount = computed<FundingBankAccount | null>(() => {
    const id = this.selectedFundingAccountId();
    return this.fundingAccounts().find((a) => a.id === id) ?? this.fundingAccounts()[0] ?? null;
  });
  readonly fundingMethod = signal<FundingMethod>('ACH');
  readonly fundingMethods: FundingMethod[] = ['ACH', 'Wire', 'Debit Card'];
  readonly accountNumberVisible = signal(false);

  // --- Activity ----------------------------------------------------
  readonly recentActivity = signal<WalletTransaction[]>([]);
  readonly activitySummary = signal<WalletActivitySummary | null>(null);

  // --- Chart controls ----------------------------------------------
  readonly chartKind = signal<ChartKind>('bar');
  readonly chartRange = signal<ChartRange>('month');

  readonly loading = signal(false);

  /** Called once by the dashboard shell (idempotent). */
  load(): void {
    if (this.wallets().length > 0) {
      return;
    }
    this.loading.set(true);
    this.api.getWallets().subscribe((wallets) => {
      this.wallets.set(wallets);
      const preferred = wallets.find((w) => w.isDefault) ?? wallets[0];
      if (preferred) {
        this.selectWallet(preferred.walletId);
      }
      this.loading.set(false);
    });
    this.api.getFundingAccounts().subscribe((accounts) => {
      this.fundingAccounts.set(accounts);
      this.selectedFundingAccountId.update((id) => id ?? accounts[0]?.id ?? null);
    });
  }

  selectWallet(walletId: number): void {
    if (this.selectedWalletId() !== null && this.selectedWalletId() !== walletId) {
      this.globeAngle.update((angle) => angle + 120);
    }
    this.selectedWalletId.set(walletId);
    this.api.getRecentTransactions(walletId).subscribe((txns) => this.recentActivity.set(txns));
    this.api.getActivitySummary(walletId).subscribe((summary) => this.activitySummary.set(summary));
  }

  selectFundingAccount(id: string): void {
    this.selectedFundingAccountId.set(id);
    this.accountNumberVisible.set(false);
  }

  toggleAccountNumber(): void {
    this.accountNumberVisible.update((v) => !v);
  }
}
