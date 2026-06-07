import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import {
  StockAdjustmentCreate,
  StockInCreate,
  StockMovement,
  StockOutCreate
} from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private readonly http: HttpClient) {}

  getStockMovements(productId?: number, movementType?: string): Observable<StockMovement[]> {
    let params = new HttpParams();

    if (productId !== undefined) {
      params = params.set('product_id', productId);
    }

    if (movementType) {
      params = params.set('movement_type', movementType);
    }

    return this.http.get<StockMovement[]>(`${API_BASE_URL}/stock/movements`, { params });
  }

  createStockIn(payload: StockInCreate): Observable<StockMovement> {
    return this.http.post<StockMovement>(`${API_BASE_URL}/stock/in`, payload);
  }

  createStockOut(payload: StockOutCreate): Observable<StockMovement> {
    return this.http.post<StockMovement>(`${API_BASE_URL}/stock/out`, payload);
  }

  createStockAdjustment(payload: StockAdjustmentCreate): Observable<StockMovement> {
    return this.http.post<StockMovement>(`${API_BASE_URL}/stock/adjust`, payload);
  }
}
