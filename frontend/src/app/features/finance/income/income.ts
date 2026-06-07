import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import {
  FinancialTransaction,
  FinancialTransactionUpdate,
  IncomeCreate
} from '../../../core/models/finance.model';
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
  protected isSubmitting = false;
  protected errorMessage = '';
  protected formError = '';

  protected isFormOpen = false;
  protected editingRecord: FinancialTransaction | null = null;
  protected title = '';
  protected amount: number | null = null;
  protected transactionDate = '';
  protected description = '';

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

  protected openCreateForm(): void {
    this.isFormOpen = true;
    this.editingRecord = null;
    this.title = '';
    this.amount = null;
    this.transactionDate = '';
    this.description = '';
    this.formError = '';
  }

  protected openEditForm(record: FinancialTransaction): void {
    this.isFormOpen = true;
    this.editingRecord = record;
    this.title = record.title;
    this.amount = Number(record.amount);
    this.transactionDate = record.transaction_date;
    this.description = record.description || '';
    this.formError = '';
  }

  protected closeForm(): void {
    this.isFormOpen = false;
    this.editingRecord = null;
    this.title = '';
    this.amount = null;
    this.transactionDate = '';
    this.description = '';
    this.formError = '';
  }

  protected handleSubmit(): void {
    this.formError = '';

    if (!this.title.trim()) {
      this.formError = 'Income title is required.';
      return;
    }

    if (this.amount === null || this.amount <= 0) {
      this.formError = 'Amount must be greater than zero.';
      return;
    }

    this.isSubmitting = true;

    if (this.editingRecord) {
      const payload: FinancialTransactionUpdate = {
        title: this.title.trim(),
        amount: this.amount,
        transaction_date: this.transactionDate || null,
        description: this.description.trim() || null
      };

      this.financeService.updateTransaction(this.editingRecord.id, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeForm();
          this.loadIncomeRecords();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update income record.';
        }
      });

      return;
    }

    const payload: IncomeCreate = {
      title: this.title.trim(),
      amount: this.amount,
      transaction_date: this.transactionDate || null,
      description: this.description.trim() || null
    };

    this.financeService.createIncome(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeForm();
        this.loadIncomeRecords();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create income record.';
      }
    });
  }

  protected deleteIncome(record: FinancialTransaction): void {
    const confirmed = confirm(`Delete income record "${record.title}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    this.financeService.deleteTransaction(record.id).subscribe({
      next: () => {
        this.loadIncomeRecords();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to delete income record.';
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
