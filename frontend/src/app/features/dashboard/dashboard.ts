import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Briefcase,
  ChevronRight,
  DollarSign,
  LucideAngularModule,
  Package,
  Plus,
  RefreshCw,
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
import { WorkspaceContextService } from '../../core/workspace/workspace-context.service';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card';

interface QuickAction {
  label: string;
  description: string;
  route: string;
  icon: any;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, BadgeComponent, StatCardComponent, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  protected summary: DashboardSummary | null = null;
  protected recentActivity: DashboardRecentActivity | null = null;
  protected lowStockAlertProducts: Product[] = [];
  protected isLoading = false;
  protected errorMessage = '';

  protected readonly productsIcon = Package;
  protected readonly lowStockIcon = AlertTriangle;
  protected readonly suppliersIcon = Truck;
  protected readonly incomeIcon = TrendingUp;
  protected readonly expenseIcon = TrendingDown;
  protected readonly balanceIcon = Briefcase;
  protected readonly plusIcon = Plus;
  protected readonly refreshIcon = RefreshCw;
  protected readonly chevronRightIcon = ChevronRight;
  protected readonly stockInIcon = ArrowDown;
  protected readonly stockOutIcon = ArrowUp;
  protected readonly financeIcon = DollarSign;

  protected readonly quickActions: QuickAction[] = [
    {
      label: 'Add product',
      description: 'Create an inventory item and set its starting stock.',
      route: '/app/products',
      icon: Plus
    },
    {
      label: 'Record stock in',
      description: 'Capture incoming inventory from a supplier or adjustment.',
      route: '/app/stock/in',
      icon: ArrowDown
    },
    {
      label: 'Record stock out',
      description: 'Track products sold, used, damaged, or removed.',
      route: '/app/stock/out',
      icon: ArrowUp
    }
  ];

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly productService: ProductService,
    private readonly workspaceContext: WorkspaceContextService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  protected refreshDashboard(): void {
    this.loadDashboardData();
  }

  protected get workspaceName(): string {
    return this.workspaceContext.workspaceName('your workspace');
  }

  protected get todayLabel(): string {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date());
  }

  protected get totalProducts(): string {
    return String(this.summary?.total_products ?? 0);
  }

  protected get totalProductsNumber(): number {
    return this.summary?.total_products ?? 0;
  }

  protected get lowStockProductsCount(): string {
    return String(this.summary?.low_stock_products ?? 0);
  }

  protected get lowStockProductsNumber(): number {
    return this.summary?.low_stock_products ?? 0;
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

  protected get recentStockMovements(): RecentStockMovement[] {
    return this.recentActivity?.recent_stock_movements ?? [];
  }

  protected get recentFinancialTransactions(): RecentFinancialTransaction[] {
    return this.recentActivity?.recent_financial_transactions ?? [];
  }

  protected get stockHealthScore(): number {
    if (this.totalProductsNumber === 0) {
      return 0;
    }

    const lowStockRatio = this.lowStockProductsNumber / this.totalProductsNumber;

    return Math.max(0, 100 - Math.round(lowStockRatio * 100));
  }

  protected get stockHealthLabel(): string {
    if (this.totalProductsNumber === 0) {
      return 'Ready for your first product';
    }

    if (this.lowStockProductsNumber === 0) {
      return 'Inventory looks healthy';
    }

    return `${this.lowStockProductsNumber} item${
      this.lowStockProductsNumber === 1 ? '' : 's'
    } need attention`;
  }

  protected formatCurrency(value: string | number | null | undefined): string {
    const numericValue = Number(value ?? 0);

    return `\u09F3 ${numericValue.toLocaleString('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }

  protected formatMovementType(type: string): string {
    return type
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  protected formatMovementQuantity(quantity: number): string {
    return quantity > 0 ? `+${quantity}` : String(quantity);
  }

  protected formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  protected getMovementTone(type: string): 'success' | 'danger' | 'info' | 'neutral' {
    if (type === 'stock_in' || type === 'initial_stock') {
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

  protected getMovementIcon(type: string): any {
    return type === 'stock_out' ? this.stockOutIcon : this.stockInIcon;
  }

  protected getTransactionTone(type: string): 'success' | 'danger' | 'neutral' {
    return type === 'income' ? 'success' : type === 'expense' ? 'danger' : 'neutral';
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
        this.summary = null;
        this.isLoading = false;
        this.errorMessage = 'Unable to refresh the workspace summary right now.';
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
}
