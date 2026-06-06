import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { DashboardRecentActivity, DashboardSummary } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${API_BASE_URL}/dashboard/summary`);
  }

  getRecentActivity(limit = 5): Observable<DashboardRecentActivity> {
    return this.http.get<DashboardRecentActivity>(
      `${API_BASE_URL}/dashboard/recent-activity?limit=${limit}`
    );
  }
}
