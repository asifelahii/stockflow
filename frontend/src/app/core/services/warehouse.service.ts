import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import {
  Warehouse,
  WarehouseCreate,
  WarehouseInventory,
  WarehouseUpdate
} from '../models/warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  constructor(private readonly http: HttpClient) {}

  getWarehouses(includeInactive = true): Observable<Warehouse[]> {
    const params = new HttpParams().set('include_inactive', String(includeInactive));

    return this.http.get<Warehouse[]>(`${API_BASE_URL}/warehouses`, { params });
  }

  getWarehouse(warehouseId: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${API_BASE_URL}/warehouses/${warehouseId}`);
  }

  createWarehouse(payload: WarehouseCreate): Observable<Warehouse> {
    return this.http.post<Warehouse>(`${API_BASE_URL}/warehouses`, payload);
  }

  updateWarehouse(warehouseId: number, payload: WarehouseUpdate): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${API_BASE_URL}/warehouses/${warehouseId}`, payload);
  }

  deactivateWarehouse(warehouseId: number): Observable<Warehouse> {
    return this.http.delete<Warehouse>(`${API_BASE_URL}/warehouses/${warehouseId}`);
  }

  getWarehouseInventory(warehouseId: number): Observable<WarehouseInventory[]> {
    return this.http.get<WarehouseInventory[]>(
      `${API_BASE_URL}/warehouses/${warehouseId}/inventory`
    );
  }
}
