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
  Search,
  Trash2,
  TrendingUp
} from 'lucide-angular';

import {
  FinancialSummary,
  FinancialTransaction,
  FinancialTransactionUpdate,
  IncomeCreate
} from '../../../core/models/finance.model';
import { FinanceService } from '../../../core/services/finance.service';
import { ToastService } from '../../../core/services/toast.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { DrawerComponent } from '../../../shared/components/drawer/drawer';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { FinanceSummaryComponent } from '../../../shared/components/finance-summary/finance-summary';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-income',
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
  templateUrl: './income.html',
  styleUrl: './income.scss'
})
export class IncomeComponent implements OnInit {
  protected searchTerm = '';
  protected dateFilter = '';
  protected incomeRecords: FinancialTransaction[] = [];
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
  protected description = '';

  protected readonly plusIcon = Plus;
  protected readonly searchIcon = Search;
  protected readonly calendarIcon = Calendar;
  protected readonly incomeIcon = TrendingUp;
  protected readonly moneyIcon = DollarSign;
  protected readonly editIcon = Pencil;
  protected readonly deleteIcon = Trash2;
  protected readonly alertIcon = AlertTriangle;

  constructor(
    private readonly financeService: FinanceService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadIncomeRecords();
  }

  protected loadIncomeRecords(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      records: this.financeService.getTransactions('income'),
      summary: this.financeService.getSummary()
    }).subscribe({
      next: ({ records, summary }) => {
        this.incomeRecords = records;
        this.financialSummary = summary;
        this.isLoading = false;
      },
      error: () => {
        this.incomeRecords = [];
        this.financialSummary = null;
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
    this.transactionDate = this.getTodayIso();
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

  protected clearFilters(): void {
    this.searchTerm = '';
    this.dateFilter = '';
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
          this.toastService.success('Income updated', 'Income record was updated successfully.');
          this.closeForm();
          this.loadIncomeRecords();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update income record.';
          this.toastService.error('Update failed', this.formError);
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
        this.toastService.success('Income recorded', 'New income record was created successfully.');
        this.closeForm();
        this.loadIncomeRecords();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create income record.';
        this.toastService.error('Create failed', this.formError);
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
        this.toastService.success('Income deleted', 'Income record was deleted successfully.');
        this.loadIncomeRecords();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to delete income record.';
        this.toastService.error('Delete failed', this.errorMessage);
      }
    });
  }

  protected get filteredIncomeRecords(): FinancialTransaction[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.incomeRecords.filter((record) => {
      const matchesSearch =
        record.title.toLowerCase().includes(searchValue) ||
        String(record.amount).includes(searchValue) ||
        (record.description || '').toLowerCase().includes(searchValue);

      const matchesDate = !this.dateFilter || record.transaction_date === this.dateFilter;

      return matchesSearch && matchesDate;
    });
  }

  protected get totalVisibleIncome(): number {
    return this.filteredIncomeRecords.reduce(
      (sum, record) => sum + Number(record.amount),
      0
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
