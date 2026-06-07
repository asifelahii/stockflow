import { Component, OnInit } from '@angular/core';

import { DashboardSummary } from '../../core/models/dashboard.model';
import { FinancialSummary, FinancialTransaction } from '../../core/models/finance.model';
import { Product } from '../../core/models/product.model';
import { StockMovement } from '../../core/models/stock.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { FinanceService } from '../../core/services/finance.service';
import { ProductService } from '../../core/services/product.service';
import { StockService } from '../../core/services/stock.service';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-reports',
  imports: [
    BadgeComponent,
    EmptyStateComponent,
    LoadingStateComponent,
    PageHeaderComponent
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent implements OnInit {
  protected dashboardSummary: DashboardSummary | null = null;
  protected financialSummary: FinancialSummary | null = null;
  protected products: Product[] = [];
  protected transactions: FinancialTransaction[] = [];
  protected stockMovements: StockMovement[] = [];

  protected isLoading = false;
  protected errorMessage = '';

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly financeService: FinanceService,
    private readonly productService: ProductService,
    private readonly stockService: StockService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  protected loadReports(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getSummary().subscribe({
      next: (summary) => {
        this.dashboardSummary = summary;
      }
    });

    this.financeService.getSummary().subscribe({
      next: (summary) => {
        this.financialSummary = summary;
      }
    });

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      }
    });

    this.financeService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      }
    });

    this.stockService.getStockMovements().subscribe({
      next: (movements) => {
        this.stockMovements = movements;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load reports.';
      }
    });
  }

  protected get lowStockProducts(): Product[] {
    return this.products.filter((product) => {
      return product.is_active && product.current_stock <= product.low_stock_threshold;
    });
  }

  protected get inactiveProducts(): Product[] {
    return this.products.filter((product) => !product.is_active);
  }

  protected get incomeTransactions(): FinancialTransaction[] {
    return this.transactions.filter((transaction) => transaction.transaction_type === 'income');
  }

  protected get expenseTransactions(): FinancialTransaction[] {
    return this.transactions.filter((transaction) => transaction.transaction_type === 'expense');
  }

  protected get recentTransactions(): FinancialTransaction[] {
    return this.transactions.slice(0, 8);
  }

  protected get recentStockMovements(): StockMovement[] {
    return this.stockMovements.slice(0, 8);
  }

  protected formatCurrency(value: string | number | null | undefined): string {
    const numericValue = Number(value ?? 0);

    return `৳ ${numericValue.toLocaleString('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }

  protected formatMovementType(type: string): string {
    return type
      .replace('_', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  protected getMovementTone(type: string): 'success' | 'danger' | 'info' | 'neutral' {
    if (type === 'stock_in') {
      return 'success';
    }

    if (type === 'stock_out') {
      return 'danger';
    }

    if (type === 'adjustment') {
      return 'info';
    }

    return 'neutral';
  }

  protected getTransactionTone(type: string): 'success' | 'danger' | 'neutral' {
    if (type === 'income') {
      return 'success';
    }

    if (type === 'expense') {
      return 'danger';
    }

    return 'neutral';
  }

  protected exportProductsCsv(): void {
    const rows = [
      ['ID', 'Name', 'SKU', 'Stock', 'Low Stock Threshold', 'Selling Price', 'Status'],
      ...this.products.map((product) => [
        product.id,
        product.name,
        product.sku,
        product.current_stock,
        product.low_stock_threshold,
        product.selling_price,
        product.is_active ? 'Active' : 'Inactive'
      ])
    ];

    this.downloadCsv('stockflow-products-report.csv', rows);
  }

  protected exportTransactionsCsv(): void {
    const rows = [
      ['ID', 'Type', 'Title', 'Amount', 'Date', 'Description'],
      ...this.transactions.map((transaction) => [
        transaction.id,
        transaction.transaction_type,
        transaction.title,
        transaction.amount,
        transaction.transaction_date,
        transaction.description || ''
      ])
    ];

    this.downloadCsv('stockflow-finance-report.csv', rows);
  }

  protected exportStockMovementsCsv(): void {
    const rows = [
      ['ID', 'Product ID', 'Type', 'Quantity', 'Previous Stock', 'New Stock', 'Reason', 'Created At'],
      ...this.stockMovements.map((movement) => [
        movement.id,
        movement.product_id,
        movement.movement_type,
        movement.quantity,
        movement.previous_stock,
        movement.new_stock,
        movement.reason || '',
        movement.created_at
      ])
    ];

    this.downloadCsv('stockflow-stock-movements-report.csv', rows);
  }

  private downloadCsv(filename: string, rows: Array<Array<string | number>>): void {
    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }
}
