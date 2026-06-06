import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Supplier, SupplierCreate, SupplierUpdate } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(private readonly http: HttpClient) {}

  getSuppliers(search?: string): Observable<Supplier[]> {
    let params = new HttpParams();

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Supplier[]>(`${API_BASE_URL}/suppliers`, { params });
  }

  getSupplierById(supplierId: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${API_BASE_URL}/suppliers/${supplierId}`);
  }

  createSupplier(payload: SupplierCreate): Observable<Supplier> {
    return this.http.post<Supplier>(`${API_BASE_URL}/suppliers`, payload);
  }

  updateSupplier(supplierId: number, payload: SupplierUpdate): Observable<Supplier> {
    return this.http.put<Supplier>(`${API_BASE_URL}/suppliers/${supplierId}`, payload);
  }

  deleteSupplier(supplierId: number): Observable<Supplier> {
    return this.http.delete<Supplier>(`${API_BASE_URL}/suppliers/${supplierId}`);
  }
}
