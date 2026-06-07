import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import {
  ExpenseCreate,
  FinancialSummary,
  FinancialTransaction,
  FinancialTransactionUpdate,
  IncomeCreate
} from '../models/finance.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  constructor(private readonly http: HttpClient) {}

  getTransactions(transactionType?: string): Observable<FinancialTransaction[]> {
    let params = new HttpParams();

    if (transactionType) {
      params = params.set('transaction_type', transactionType);
    }

    return this.http.get<FinancialTransaction[]>(`${API_BASE_URL}/finance/transactions`, { params });
  }

  getTransactionById(transactionId: number): Observable<FinancialTransaction> {
    return this.http.get<FinancialTransaction>(`${API_BASE_URL}/finance/transactions/${transactionId}`);
  }

  createIncome(payload: IncomeCreate): Observable<FinancialTransaction> {
    return this.http.post<FinancialTransaction>(`${API_BASE_URL}/finance/income`, payload);
  }

  createExpense(payload: ExpenseCreate): Observable<FinancialTransaction> {
    return this.http.post<FinancialTransaction>(`${API_BASE_URL}/finance/expenses`, payload);
  }

  updateTransaction(
    transactionId: number,
    payload: FinancialTransactionUpdate
  ): Observable<FinancialTransaction> {
    return this.http.put<FinancialTransaction>(
      `${API_BASE_URL}/finance/transactions/${transactionId}`,
      payload
    );
  }

  deleteTransaction(transactionId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/finance/transactions/${transactionId}`);
  }

  getSummary(): Observable<FinancialSummary> {
    return this.http.get<FinancialSummary>(`${API_BASE_URL}/finance/summary`);
  }
}
