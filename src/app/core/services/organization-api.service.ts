import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import { ApiResponse, CompanyEntity, OrganizationUser } from '../models';
import { MOCK_ENTITIES, MOCK_ORG_USERS } from '../mock/mock-data';
import { API_BASE_URL, USE_MOCK_API } from './api-config';

/**
 * Typed HttpClient gateway to the .NET Core organization endpoints:
 *
 *   GET /api/v1/organization/entities -> ApiResponse<List<CompanyEntity>>
 *   GET /api/v1/organization/users    -> ApiResponse<List<OrganizationUser>>
 */
@Injectable({ providedIn: 'root' })
export class OrganizationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly useMock = inject(USE_MOCK_API);

  getEntities(): Observable<CompanyEntity[]> {
    if (this.useMock) {
      return of(MOCK_ENTITIES).pipe(delay(120));
    }
    return this.http
      .get<ApiResponse<CompanyEntity[]>>(`${this.baseUrl}/organization/entities`)
      .pipe(map((res) => res.data));
  }

  getUsers(): Observable<OrganizationUser[]> {
    if (this.useMock) {
      return of(MOCK_ORG_USERS).pipe(delay(120));
    }
    return this.http
      .get<ApiResponse<OrganizationUser[]>>(`${this.baseUrl}/organization/users`)
      .pipe(map((res) => res.data));
  }
}
