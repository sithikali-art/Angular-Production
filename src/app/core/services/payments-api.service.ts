import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import { ApiResponse, DraftPayment } from '../models';
import { MOCK_DRAFTS } from '../mock/mock-data';
import { API_BASE_URL, USE_MOCK_API } from './api-config';

/**
 * .NET Core endpoints:
 *   GET    /api/v1/payments/drafts      -> ApiResponse<List<DraftPayment>>
 *   DELETE /api/v1/payments/drafts/{id} -> ApiResponse<bool>
 */
@Injectable({ providedIn: 'root' })
export class PaymentsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly useMock = inject(USE_MOCK_API);

  getDrafts(): Observable<DraftPayment[]> {
    if (this.useMock) {
      return of(MOCK_DRAFTS).pipe(delay(120));
    }
    return this.http
      .get<ApiResponse<DraftPayment[]>>(`${this.baseUrl}/payments/drafts`)
      .pipe(map((res) => res.data));
  }

  deleteDraft(id: string): Observable<boolean> {
    if (this.useMock) {
      return of(true).pipe(delay(150));
    }
    return this.http
      .delete<ApiResponse<boolean>>(`${this.baseUrl}/payments/drafts/${id}`)
      .pipe(map((res) => res.data));
  }
}
