import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import { ApiResponse, ApprovalItem } from '../models';
import { MOCK_APPROVALS } from '../mock/mock-data';
import { API_BASE_URL, USE_MOCK_API } from './api-config';

/**
 * .NET Core endpoints:
 *   GET  /api/v1/approvals?status=Pending -> ApiResponse<List<ApprovalItem>>
 *   POST /api/v1/approvals/{id}/approve   -> ApiResponse<ApprovalItem>
 *   POST /api/v1/approvals/{id}/decline   -> ApiResponse<ApprovalItem>
 */
@Injectable({ providedIn: 'root' })
export class ApprovalsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly useMock = inject(USE_MOCK_API);

  getPending(): Observable<ApprovalItem[]> {
    if (this.useMock) {
      return of(MOCK_APPROVALS).pipe(delay(120));
    }
    return this.http
      .get<ApiResponse<ApprovalItem[]>>(`${this.baseUrl}/approvals`, {
        params: { status: 'Pending' },
      })
      .pipe(map((res) => res.data));
  }

  approve(id: string): Observable<ApprovalItem> {
    if (this.useMock) {
      const item = MOCK_APPROVALS.find((a) => a.id === id)!;
      return of({ ...item, status: 'Approved' as const }).pipe(delay(200));
    }
    return this.http
      .post<ApiResponse<ApprovalItem>>(`${this.baseUrl}/approvals/${id}/approve`, {})
      .pipe(map((res) => res.data));
  }

  decline(id: string): Observable<ApprovalItem> {
    if (this.useMock) {
      const item = MOCK_APPROVALS.find((a) => a.id === id)!;
      return of({ ...item, status: 'Declined' as const }).pipe(delay(200));
    }
    return this.http
      .post<ApiResponse<ApprovalItem>>(`${this.baseUrl}/approvals/${id}/decline`, {})
      .pipe(map((res) => res.data));
  }
}
