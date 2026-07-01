import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { AuthToken, LoginRequest, RegisterRequest, UserResponse } from '../models/auth.model';

const TOKEN_KEY = 'stockflow_access_token';
const ORGANIZATION_KEY = 'stockflow_current_organization';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${API_BASE_URL}/auth/login`, payload).pipe(
      tap((response) => {
        this.setToken(response.access_token);
        localStorage.setItem(ORGANIZATION_KEY, JSON.stringify(response.organization));
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
    localStorage.removeItem(ORGANIZATION_KEY);
  }

  getCurrentOrganization(): { id: number; name: string; role: string } | null {
    const savedOrganization = localStorage.getItem(ORGANIZATION_KEY);

    if (!savedOrganization) {
      return null;
    }

    try {
      return JSON.parse(savedOrganization) as {
        id: number;
        name: string;
        role: string;
      };
    } catch {
      localStorage.removeItem(ORGANIZATION_KEY);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.removeToken();
  }
}
