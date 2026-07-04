import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import {
  AuthToken,
  LoginRequest,
  OrganizationSummary,
  RegisterRequest,
  UserResponse
} from '../models/auth.model';
import { WorkspaceContextService } from '../workspace/workspace-context.service';

const TOKEN_KEY = 'stockflow_access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly workspaceContext: WorkspaceContextService
  ) {}

  login(payload: LoginRequest): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${API_BASE_URL}/auth/login`, payload).pipe(
      tap((response) => {
        this.setToken(response.access_token);
        this.workspaceContext.setOrganization(response.organization);
      })
    );
  }

  loginPublicDemo(tenantKey: 'tenant_1' | 'tenant_2'): Observable<AuthToken> {
    return this.http
      .post<AuthToken>(`${API_BASE_URL}/auth/demo-login`, {
        tenant_key: tenantKey
      })
      .pipe(
        tap((response) => {
          this.setToken(response.access_token);
          this.workspaceContext.setOrganization(response.organization);
        })
      );
  }
  register(payload: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${API_BASE_URL}/auth/register`, payload);
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${API_BASE_URL}/auth/me`);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.workspaceContext.clear();
  }

  getCurrentOrganization(): OrganizationSummary | null {
    return this.workspaceContext.getCurrentOrganization();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.removeToken();
  }
}
