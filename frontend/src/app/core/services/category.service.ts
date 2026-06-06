import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import {
  CategoryCreate,
  CategoryUpdate,
  ExpenseCategory,
  ProductCategory
} from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private readonly http: HttpClient) {}

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${API_BASE_URL}/product-categories`);
  }

  createProductCategory(payload: CategoryCreate): Observable<ProductCategory> {
    return this.http.post<ProductCategory>(`${API_BASE_URL}/product-categories`, payload);
  }

  updateProductCategory(categoryId: number, payload: CategoryUpdate): Observable<ProductCategory> {
    return this.http.put<ProductCategory>(
      `${API_BASE_URL}/product-categories/${categoryId}`,
      payload
    );
  }

  deleteProductCategory(categoryId: number): Observable<ProductCategory> {
    return this.http.delete<ProductCategory>(`${API_BASE_URL}/product-categories/${categoryId}`);
  }

  getExpenseCategories(): Observable<ExpenseCategory[]> {
    return this.http.get<ExpenseCategory[]>(`${API_BASE_URL}/expense-categories`);
  }

  createExpenseCategory(payload: CategoryCreate): Observable<ExpenseCategory> {
    return this.http.post<ExpenseCategory>(`${API_BASE_URL}/expense-categories`, payload);
  }

  updateExpenseCategory(categoryId: number, payload: CategoryUpdate): Observable<ExpenseCategory> {
    return this.http.put<ExpenseCategory>(
      `${API_BASE_URL}/expense-categories/${categoryId}`,
      payload
    );
  }

  deleteExpenseCategory(categoryId: number): Observable<ExpenseCategory> {
    return this.http.delete<ExpenseCategory>(`${API_BASE_URL}/expense-categories/${categoryId}`);
  }
}
