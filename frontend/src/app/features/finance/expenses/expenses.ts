import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  LucideAngularModule,
  Pencil,
  Plus,
  Receipt,
  Search,
  SlidersHorizontal,
  Tags,
  Trash2,
  TrendingDown
} from 'lucide-angular';

import { ExpenseCategory } from '../../../core/models/category.model';
import {
  ExpenseCreate,
  FinancialSummary,
  FinancialTransaction,
  FinancialTransactionUpdate
} from '../../../core/models/finance.model';
import { CategoryService } from '../../../core/services/category.service';
import { FinanceService } from '../../../core/services/finance.service';
import { ToastService } from '../../../core/services/toast.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { DrawerComponent } from '../../../shared/components/drawer/drawer';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { FinanceSummaryComponent } from '../../../shared/components/finance-summary/finance-summary';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-expenses',
  imports: [
    BadgeComponent,
    DrawerComponent,
    EmptyStateComponent,
    FinanceSummaryComponent,
    FormsModule,
    LoadingStateComponent,
    LucideAngularModule,
    PageHeaderComponent
  ],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss'
})
export class ExpensesComponent implements OnInit {
  protected searchTerm = '';
  protected categoryFilter = '';
  protected dateFilter = '';
  protected expenseRecords: FinancialTransaction[] = [];
  protected expenseCategories: ExpenseCategory[] = [];
  protected financialSummary: FinancialSummary | null = null;

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

  protected readonly plusIcon = Plus;
  protected readonly searchIcon = Search;
  protected readonly filterIcon = SlidersHorizontal;
  protected readonly calendarIcon = Calendar;
  protected readonly expenseIcon = TrendingDown;
  protected readonly receiptIcon = Receipt;
  protected readonly categoryIcon = Tags;
  protected readonly moneyIcon = DollarSign;
  protected readonly editIcon = Pencil;
  protected readonly deleteIcon = Trash2;
  protected readonly alertIcon = AlertTriangle;

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
      categories: this.categoryService.getExpenseCategories(),
      summary: this.financeService.getSummary()
    }).subscribe({
      next: ({ expenses, categories, summary }) => {
        this.expenseRecords = expenses;
        this.expenseCategories = categories;
        this.financialSummary = summary;
        this.isLoading = false;
      },
      error: () => {
        this.expenseRecords = [];
        this.expenseCategories = [];
        this.financialSummary = null;
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
    this.transactionDate = this.getTodayIso();
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
    this.expenseCategoryId = record.expense_category_id
      ? String(record.expense_category_id)
      : '';
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

  protected clearFilters(): void {
    this.searchTerm = '';
    this.categoryFilter = '';
    this.dateFilter = '';
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
        expense_category_id: this.expenseCategoryId
          ? Number(this.expenseCategoryId)
          : null,
        description: this.description.trim() || null
      };

      this.financeService.updateTransaction(this.editingRecord.id, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toastService.success('Expense updated', 'Expense record was updated successfully.');
          this.closeForm();
          this.loadPageData();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update expense record.';
          this.toastService.error('Update failed', this.formError);
        }
      });

      return;
    }

    const payload: ExpenseCreate = {
      title: this.title.trim(),
      amount: this.amount,
      transaction_date: this.transactionDate || null,
      expense_category_id: this.expenseCategoryId
        ? Number(this.expenseCategoryId)
        : null,
      description: this.description.trim() || null
    };

    this.financeService.createExpense(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success('Expense recorded', 'New expense record was created successfully.');
        this.closeForm();
        this.loadPageData();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create expense record.';
        this.toastService.error('Create failed', this.formError);
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
        this.toastService.success('Expense deleted', 'Expense record was deleted successfully.');
        this.loadPageData();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to delete expense record.';
        this.toastService.error('Delete failed', this.errorMessage);
      }
    });
  }

  protected get activeExpenseCategories(): ExpenseCategory[] {
    return this.expenseCategories.filter((category) => category.is_active);
  }

  protected get filteredExpenseRecords(): FinancialTransaction[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.expenseRecords.filter((record) => {
      const categoryName = this.getExpenseCategoryName(record.expense_category_id).toLowerCase();

      const matchesSearch =
        record.title.toLowerCase().includes(searchValue) ||
        String(record.amount).includes(searchValue) ||
        categoryName.includes(searchValue) ||
        (record.description || '').toLowerCase().includes(searchValue);

      const matchesCategory =
        !this.categoryFilter ||
        String(record.expense_category_id || '') === this.categoryFilter;

      const matchesDate = !this.dateFilter || record.transaction_date === this.dateFilter;

      return matchesSearch && matchesCategory && matchesDate;
    });
  }

  protected get totalVisibleExpense(): number {
    return this.filteredExpenseRecords.reduce(
      (sum, record) => sum + Number(record.amount),
      0
    );
  }

  protected getExpenseCategoryName(categoryId: number | null): string {
    return (
      this.expenseCategories.find((category) => category.id === categoryId)?.name ||
      'Uncategorized'
    );
  }

  protected formatCurrency(value: string | number): string {
    return `\u09F3 ${Number(value ?? 0).toLocaleString('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }

  protected formatDate(value: string): string {
    const [year, month, day] = value.split('-').map(Number);

    if (!year || !month || !day) {
      return value;
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(year, month - 1, day));
  }

  private getTodayIso(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
