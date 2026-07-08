import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Product, ProductCreate, ProductMediaUpload, ProductUpdate } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  getProducts(search?: string, isLowStock?: boolean): Observable<Product[]> {
    let params = new HttpParams();

    if (search) {
      params = params.set('search', search);
    }

    if (isLowStock !== undefined) {
      params = params.set('is_low_stock', isLowStock);
    }

    return this.http.get<Product[]>(`${API_BASE_URL}/products`, { params });
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_BASE_URL}/products/low-stock`);
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${API_BASE_URL}/products/${productId}`);
  }

  createProduct(payload: ProductCreate): Observable<Product> {
    return this.http.post<Product>(`${API_BASE_URL}/products`, payload);
  }

  updateProduct(productId: number, payload: ProductUpdate): Observable<Product> {
    return this.http.put<Product>(`${API_BASE_URL}/products/${productId}`, payload);
  }


  uploadProductImage(file: File): Observable<ProductMediaUpload> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<ProductMediaUpload>(`${API_BASE_URL}/products/media/upload`, formData);
  }

  deleteProductImages(publicIds: string[]): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/products/media`, {
      body: { public_ids: publicIds }
    });
  }

  deleteProduct(productId: number, version: number): Observable<Product> {
    const params = new HttpParams().set('version', String(version));

    return this.http.delete<Product>(
      `${API_BASE_URL}/products/${productId}`,
      { params }
    );
  }
}
