import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { ExpenseCategory } from '../../../core/models/category.model';
import {
  ExpenseCreate,
  FinancialTransaction,
  FinancialTransactionUpdate
} from '../../../core/models/finance.model';
import { CategoryService } from '../../../core/services/category.service';
import { FinanceService } from '../../../core/services/finance.service';
import { ToastService } from '../../../core/services/toast.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-expenses',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, LoadingStateComponent, PageHeaderComponent],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss'
})
export class ExpensesComponent implements OnInit {
  protected searchTerm = '';
  protected expenseRecords: FinancialTransaction[] = [];
  protected expenseCategories: ExpenseCategory[] = [];

  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';
  protected formError = '';

  protected isFormOpen = false;
  protected editingRecord: FinancialTransaction | null = null;

  protected title = '';
  protected amount: number | null = null;
  protected transactionDate = '';
  protected expenseCategoryId = '';
  protected description = '';

  constructor(
    private readonly financeService: FinanceService,
    private readonly categoryService: CategoryService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPageData();
  }

  protected loadPageData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      expenses: this.financeService.getTransactions('expense'),
      categories: this.categoryService.getExpenseCategories()
    }).subscribe({
      next: ({ expenses, categories }) => {
        this.expenseRecords = expenses;
        this.expenseCategories = categories;
        this.isLoading = false;
      },
      error: () => {
        this.expenseRecords = [];
        this.expenseCategories = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load expense records.';
      }
    });
  }

  protected openCreateForm(): void {
    this.isFormOpen = true;
    this.editingRecord = null;
    this.title = '';
    this.amount = null;
    this.transactionDate = '';
    this.expenseCategoryId = '';
    this.description = '';
    this.formError = '';
  }

  protected openEditForm(record: FinancialTransaction): void {
    this.isFormOpen = true;
    this.editingRecord = record;
    this.title = record.title;
    this.amount = Number(record.amount);
    this.transactionDate = record.transaction_date;
    this.expenseCategoryId = record.expense_category_id ? String(record.expense_category_id) : '';
    this.description = record.description || '';
    this.formError = '';
  }

  protected closeForm(): void {
    this.isFormOpen = false;
    this.editingRecord = null;
    this.title = '';
    this.amount = null;
    this.transactionDate = '';
    this.expenseCategoryId = '';
    this.description = '';
    this.formError = '';
  }

  protected handleSubmit(): void {
    this.formError = '';

    if (!this.title.trim()) {
      this.formError = 'Expense title is required.';
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
        expense_category_id: this.expenseCategoryId ? Number(this.expenseCategoryId) : null,
        description: this.description.trim() || null
      };

      this.financeService.updateTransaction(this.editingRecord.id, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeForm();
          this.loadPageData();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update expense record.';
        }
      });

      return;
    }

    const payload: ExpenseCreate = {
      title: this.title.trim(),
      amount: this.amount,
      transaction_date: this.transactionDate || null,
      expense_category_id: this.expenseCategoryId ? Number(this.expenseCategoryId) : null,
      description: this.description.trim() || null
    };

    this.financeService.createExpense(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeForm();
        this.loadPageData();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create expense record.';
      }
    });
  }

  protected deleteExpense(record: FinancialTransaction): void {
    const confirmed = confirm(`Delete expense record "${record.title}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    this.financeService.deleteTransaction(record.id).subscribe({
      next: () => {
        this.loadPageData();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to delete expense record.';
      }
    });
  }

  protected get activeExpenseCategories(): ExpenseCategory[] {
    return this.expenseCategories.filter((category) => category.is_active);
  }

  protected getExpenseCategoryName(categoryId: number | null): string {
    return this.expenseCategories.find((category) => category.id === categoryId)?.name || '—';
  }

  protected get filteredExpenseRecords(): FinancialTransaction[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.expenseRecords.filter((record) => {
      return (
        record.title.toLowerCase().includes(searchValue) ||
        String(record.amount).toLowerCase().includes(searchValue) ||
        record.transaction_date.toLowerCase().includes(searchValue) ||
        this.getExpenseCategoryName(record.expense_category_id).toLowerCase().includes(searchValue) ||
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

