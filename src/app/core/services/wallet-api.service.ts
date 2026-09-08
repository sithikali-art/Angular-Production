import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import {
  ApiResponse,
  FundingBankAccount,
  Wallet,
  WalletActivitySummary,
  WalletTransaction,
} from '../models';
import {
  MOCK_FUNDING_ACCOUNTS,
  MOCK_MONTHLY_ACTIVITY,
  MOCK_RECENT_ACTIVITY,
  MOCK_WALLETS,
} from '../mock/mock-data';
import { API_BASE_URL, USE_MOCK_API } from './api-config';

/**
 * Typed HttpClient gateway to the .NET Core wallet endpoints:
 *
 *   GET /api/v1/wallets                     -> ApiResponse<List<Wallet>>
 *   GET /api/v1/wallets/{id}/transactions   -> ApiResponse<List<WalletTransaction>>
 *   GET /api/v1/wallets/{id}/activity       -> ApiResponse<WalletActivitySummary>
 *   GET /api/v1/funding/bank-accounts       -> ApiResponse<List<FundingBankAccount>>
 *
 * Components never call this directly — state services own the calls
 * and expose the results as signals.
 */
@Injectable({ providedIn: 'root' })
export class WalletApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly useMock = inject(USE_MOCK_API);

  getWallets(): Observable<Wallet[]> {
    if (this.useMock) {
      return of(MOCK_WALLETS).pipe(delay(120));
    }
    return this.http
      .get<ApiResponse<Wallet[]>>(`${this.baseUrl}/wallets`)
      .pipe(map((res) => res.data));
  }

  getRecentTransactions(walletId: number, take = 5): Observable<WalletTransaction[]> {
    if (this.useMock) {
      return of(MOCK_RECENT_ACTIVITY.filter((t) => t.walletId === walletId).slice(0, take)).pipe(
        delay(120),
      );
    }
    return this.http
      .get<ApiResponse<WalletTransaction[]>>(
        `${this.baseUrl}/wallets/${walletId}/transactions`,
        { params: { take } },
      )
      .pipe(map((res) => res.data));
  }

  getActivitySummary(walletId: number): Observable<WalletActivitySummary> {
    if (this.useMock) {
      return of(this.buildMockSummary(walletId)).pipe(delay(160));
    }
    return this.http
      .get<ApiResponse<WalletActivitySummary>>(`${this.baseUrl}/wallets/${walletId}/activity`)
      .pipe(map((res) => res.data));
  }

  /**
   * Demo-only: derive a distinct credits/debits series per wallet so
   * the chart visibly changes when the user switches currency.
   */
  private buildMockSummary(walletId: number): WalletActivitySummary {
    const wallet = MOCK_WALLETS.find((w) => w.walletId === walletId) ?? MOCK_WALLETS[0];
    const variants: Record<number, { offset: number; factor: number; balance: number }> = {
      982734: { offset: 0, factor: 1, balance: 2574.14 },
      982730: { offset: 3, factor: 0.82, balance: 10596.12 },
      982731: { offset: 6, factor: 0.64, balance: 2300.0 },
      982728: { offset: 9, factor: 0.9, balance: 5100.0 },
    };
    const v = variants[wallet.walletId] ?? variants[982734];
    const series = MOCK_MONTHLY_ACTIVITY.map((point, i) => {
      const src = MOCK_MONTHLY_ACTIVITY[(i + v.offset) % MOCK_MONTHLY_ACTIVITY.length];
      return {
        month: point.month,
        credits: Math.round(src.credits * v.factor),
        debits: Math.round(src.debits * v.factor),
      };
    });
    return {
      walletId: wallet.walletId,
      walletName: `${wallet.currency} — ${wallet.name}`,
      currency: wallet.currency,
      balance: v.balance,
      totalCredits: Math.round(series.reduce((sum, p) => sum + p.credits, 0) * 0.98),
      totalDebits: Math.round(series.reduce((sum, p) => sum + p.debits, 0) * 0.98),
      series,
    };
  }

  getFundingAccounts(): Observable<FundingBankAccount[]> {
    if (this.useMock) {
      return of(MOCK_FUNDING_ACCOUNTS).pipe(delay(100));
    }
    return this.http
      .get<ApiResponse<FundingBankAccount[]>>(`${this.baseUrl}/funding/bank-accounts`)
      .pipe(map((res) => res.data));
  }
}
