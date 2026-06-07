import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { FinancialTransaction } from '../../../core/models/finance.model';
import { FinanceService } from '../../../core/services/finance.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-income',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, LoadingStateComponent, PageHeaderComponent],
  templateUrl: './income.html',
  styleUrl: './income.scss'
})
export class IncomeComponent implements OnInit {
  protected searchTerm = '';
  protected incomeRecords: FinancialTransaction[] = [];
  protected isLoading = false;
  protected errorMessage = '';

  constructor(private readonly financeService: FinanceService) {}

  ngOnInit(): void {
    this.loadIncomeRecords();
  }

  protected loadIncomeRecords(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.financeService.getTransactions('income').subscribe({
      next: (records) => {
        this.incomeRecords = records;
        this.isLoading = false;
      },
      error: () => {
        this.incomeRecords = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load income records.';
      }
    });
  }

  protected get filteredIncomeRecords(): FinancialTransaction[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.incomeRecords.filter((record) => {
      return (
        record.title.toLowerCase().includes(searchValue) ||
        String(record.amount).toLowerCase().includes(searchValue) ||
        record.transaction_date.toLowerCase().includes(searchValue) ||
        (record.description || '').toLowerCase().includes(searchValue) ||
        record.transaction_type.toLowerCase().includes(searchValue)
      );
    });
  }

  protected formatCurrency(value: string | number): string {
    const numericValue = Number(value ?? 0);

    return `৳ ${numericValue.toLocaleString('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }

  protected formatTransactionType(type: string): string {
    return type
      .replace('_', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
}
