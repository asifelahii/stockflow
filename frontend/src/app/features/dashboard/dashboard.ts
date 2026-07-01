import { Component, OnInit } from '@angular/core';
import {
  AlertTriangle,
  Briefcase,
  LucideAngularModule,
  Package,
  TrendingDown,
  TrendingUp,
  Truck
} from 'lucide-angular';

import {
  DashboardRecentActivity,
  DashboardSummary,
  RecentFinancialTransaction,
  RecentStockMovement
} from '../../core/models/dashboard.model';
import { Product } from '../../core/models/product.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { ProductService } from '../../core/services/product.service';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card';

@Component({
  selector: 'app-dashboard',
  imports: [BadgeComponent, PageHeaderComponent, StatCardComponent, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  protected summary: DashboardSummary | null = null;
  protected recentActivity: DashboardRecentActivity | null = null;
  protected isLoading = false;
  protected errorMessage = '';

  protected readonly productsIcon = Package;
  protected readonly lowStockIcon = AlertTriangle;
  protected readonly suppliersIcon = Truck;
  protected readonly incomeIcon = TrendingUp;
  protected readonly expenseIcon = TrendingDown;
  protected readonly balanceIcon = Briefcase;

  protected lowStockAlertProducts: Product[] = [];

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load dashboard summary.';
      }
    });

    this.dashboardService.getRecentActivity(5).subscribe({
      next: (activity) => {
        this.recentActivity = activity;
      },
      error: () => {
        this.recentActivity = null;
      }
    });

    this.productService.getLowStockProducts().subscribe({
      next: (products) => {
        this.lowStockAlertProducts = products;
      },
      error: () => {
        this.lowStockAlertProducts = [];
      }
    });
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

  protected get recentStockMovements(): RecentStockMovement[] {
    return this.recentActivity?.recent_stock_movements ?? [];
  }

  protected get recentFinancialTransactions(): RecentFinancialTransaction[] {
    return this.recentActivity?.recent_financial_transactions ?? [];
  }

  protected get totalProducts(): string {
    return String(this.summary?.total_products ?? 0);
  }

  protected get lowStockProductsCount(): string {
    return String(this.summary?.low_stock_products ?? 0);
  }

  protected get totalSuppliers(): string {
    return String(this.summary?.total_suppliers ?? 0);
  }

  protected get totalIncome(): string {
    return this.formatCurrency(this.summary?.total_income);
  }

  protected get totalExpense(): string {
    return this.formatCurrency(this.summary?.total_expense);
  }

  protected get netBalance(): string {
    return this.formatCurrency(this.summary?.net_balance);
  }
}
