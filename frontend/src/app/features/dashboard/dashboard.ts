import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Briefcase,
  CalendarDays,
  ChevronRight,
  DollarSign,
  LucideAngularModule,
  Package,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Truck,
  WalletCards
} from 'lucide-angular';

import {
  DashboardAnalytics,
  DashboardExpenseBreakdownItem,
  DashboardFinanceTrendPoint,
  DashboardRecentActivity,
  DashboardStockTrendPoint,
  DashboardSummary,
  RecentFinancialTransaction,
  RecentStockMovement
} from '../../core/models/dashboard.model';
import { Product } from '../../core/models/product.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { ProductService } from '../../core/services/product.service';
import { WorkspaceContextService } from '../../core/workspace/workspace-context.service';
import { BadgeComponent } from '../../shared/components/badge/badge';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, RouterLink, BadgeComponent, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  protected summary: DashboardSummary | null = null;
  protected analytics: DashboardAnalytics | null = null;
  protected recentActivity: DashboardRecentActivity | null = null;
  protected lowStockAlertProducts: Product[] = [];
  protected selectedMonths = 6;
  protected hoveredFinanceIndex: number | null = null;
  protected hoveredStockIndex: number | null = null;
  protected hoveredExpenseIndex: number | null = null;

  protected isLoading = false;
  protected errorMessage = '';

  protected readonly productsIcon = Package;
  protected readonly lowStockIcon = AlertTriangle;
  protected readonly suppliersIcon = Truck;
  protected readonly incomeIcon = TrendingUp;
  protected readonly expenseIcon = TrendingDown;
  protected readonly balanceIcon = Briefcase;
  protected readonly financeIcon = DollarSign;
  protected readonly refreshIcon = RefreshCw;
  protected readonly chevronRightIcon = ChevronRight;
  protected readonly stockInIcon = ArrowDown;
  protected readonly stockOutIcon = ArrowUp;
  protected readonly analyticsIcon = BarChart3;
  protected readonly calendarIcon = CalendarDays;
  protected readonly walletIcon = WalletCards;

  private readonly expenseColors = [
    '#fe9f43',
    '#2f80ed',
    '#16a085',
    '#e05d4e',
    '#8267e9'
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

  protected onPeriodChange(): void {
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

  protected get totalProductsNumber(): number {
    return this.summary?.total_products ?? 0;
  }

  protected get lowStockProductsNumber(): number {
    return this.summary?.low_stock_products ?? 0;
  }

  protected get totalSuppliersNumber(): number {
    return this.summary?.total_suppliers ?? 0;
  }

  protected get totalProducts(): string {
    return String(this.totalProductsNumber);
  }

  protected get totalSuppliers(): string {
    return String(this.totalSuppliersNumber);
  }

  protected get inventoryCostValue(): string {
    return this.formatCurrency(this.analytics?.inventory_cost_value);
  }

  protected get periodNetBalance(): string {
    return this.formatCurrency(this.analytics?.period_net_balance);
  }

  protected get periodIncome(): string {
    return this.formatCurrency(this.analytics?.period_income);
  }

  protected get periodExpense(): string {
    return this.formatCurrency(this.analytics?.period_expense);
  }

  protected get recentStockMovements(): RecentStockMovement[] {
    return this.recentActivity?.recent_stock_movements ?? [];
  }

  protected get recentFinancialTransactions(): RecentFinancialTransaction[] {
    return this.recentActivity?.recent_financial_transactions ?? [];
  }

  protected get financeTrend() {
    return this.analytics?.finance_trend ?? [];
  }

  protected get stockTrend() {
    return this.analytics?.stock_trend ?? [];
  }

  protected get expenseBreakdown(): DashboardExpenseBreakdownItem[] {
    return this.analytics?.expense_breakdown ?? [];
  }

  protected get topMovedProducts() {
    return this.analytics?.top_moved_products ?? [];
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
      return 'Ready for first inventory';
    }

    if (this.lowStockProductsNumber === 0) {
      return 'Inventory looks healthy';
    }

    return `${this.lowStockProductsNumber} product${
      this.lowStockProductsNumber === 1 ? '' : 's'
    } need attention`;
  }

  protected get maxFinanceTrendValue(): number {
    return Math.max(
      1,
      ...this.financeTrend.flatMap((point) => [
        Number(point.income),
        Number(point.expense)
      ])
    );
  }

  protected get maxStockTrendValue(): number {
    return Math.max(
      1,
      ...this.stockTrend.flatMap((point) => [
        point.stock_in,
        point.stock_out,
        point.adjustment
      ])
    );
  }

  protected get totalExpenseBreakdown(): number {
    return this.expenseBreakdown.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
  }

  protected formatCurrency(value: string | number | null | undefined): string {
    const numericValue = Number(value ?? 0);
    const taka = String.fromCharCode(0x09F3);

    return `${taka} ${numericValue.toLocaleString('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  }

  protected formatNumber(value: number): string {
    return Number(value ?? 0).toLocaleString('en-BD');
  }

  protected formatDate(value: string): string {
    const normalizedValue = value.length === 10 ? `${value}T00:00:00` : value;
    const date = new Date(normalizedValue);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    });
  }

  protected formatMovementType(type: string): string {
    return type
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  protected formatMovementQuantity(movement: RecentStockMovement): string {
    const quantity = Math.abs(movement.quantity);

    if (movement.movement_type === 'stock_in') {
      return `+${quantity}`;
    }

    if (movement.movement_type === 'stock_out') {
      return `-${quantity}`;
    }

    return `${String.fromCharCode(0x00B1)}${quantity}`;
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
    if (type === 'stock_out') {
      return this.stockOutIcon;
    }

    if (type === 'adjustment') {
      return this.refreshIcon;
    }

    return this.stockInIcon;
  }

  protected getTransactionTone(type: string): 'success' | 'danger' {
    return type === 'income' ? 'success' : 'danger';
  }

  protected getFinanceLinePoints(field: 'income' | 'expense'): string {
    if (this.financeTrend.length === 0) {
      return '';
    }

    const chartHeight = 76;
    const pointCount = this.financeTrend.length - 1;

    return this.financeTrend
      .map((point, index) => {
        const x = pointCount === 0 ? 50 : (index / pointCount) * 100;
        const y = chartHeight - (Number(point[field]) / this.maxFinanceTrendValue) * chartHeight;

        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }

  protected getFinanceAreaPoints(field: 'income' | 'expense'): string {
    const linePoints = this.getFinanceLinePoints(field);

    if (!linePoints) {
      return '';
    }

    return `0,80 ${linePoints} 100,80`;
  }

  protected getStockBarHeight(
    item: DashboardStockTrendPoint,
    field: 'stock_in' | 'stock_out' | 'adjustment'
  ): number {
    const value = item[field];

    if (!value) {
      return 0;
    }

    return Math.max(9, Math.round((value / this.maxStockTrendValue) * 100));
  }

  protected getExpenseColor(index: number): string {
    return this.expenseColors[index % this.expenseColors.length];
  }

  protected getExpenseShare(item: DashboardExpenseBreakdownItem): number {
    if (this.totalExpenseBreakdown <= 0) {
      return 0;
    }

    return Math.round((Number(item.amount) / this.totalExpenseBreakdown) * 100);
  }

  protected getExpenseDonutStyle(): string {
    if (this.expenseBreakdown.length === 0 || this.totalExpenseBreakdown <= 0) {
      return 'conic-gradient(var(--sf-surface-hover) 0deg 360deg)';
    }

    let currentAngle = 0;

    const segments = this.expenseBreakdown.map((item, index) => {
      const nextAngle =
        currentAngle + (Number(item.amount) / this.totalExpenseBreakdown) * 360;

      const segment = `${this.getExpenseColor(index)} ${currentAngle}deg ${nextAngle}deg`;
      currentAngle = nextAngle;

      return segment;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }

  protected getProductInitial(name: string): string {
    return name.trim().charAt(0).toUpperCase() || 'P';
  }

  protected getStockFillPercent(product: Product): number {
    if (product.low_stock_threshold <= 0) {
      return 100;
    }

    return Math.min(
      100,
      Math.max(
        0,
        Math.round((product.current_stock / product.low_stock_threshold) * 100)
      )
    );
  }

  protected setHoveredFinance(index: number): void {
    this.hoveredFinanceIndex = index;
  }

  protected clearHoveredFinance(): void {
    this.hoveredFinanceIndex = null;
  }

  protected setHoveredStock(index: number): void {
    this.hoveredStockIndex = index;
  }

  protected clearHoveredStock(): void {
    this.hoveredStockIndex = null;
  }

  protected setHoveredExpense(index: number): void {
    this.hoveredExpenseIndex = index;
  }

  protected clearHoveredExpense(): void {
    this.hoveredExpenseIndex = null;
  }

  protected get hoveredFinancePoint(): DashboardFinanceTrendPoint | null {
    if (this.hoveredFinanceIndex === null) {
      return null;
    }

    return this.financeTrend[this.hoveredFinanceIndex] ?? null;
  }

  protected get hoveredStockPoint(): DashboardStockTrendPoint | null {
    if (this.hoveredStockIndex === null) {
      return null;
    }

    return this.stockTrend[this.hoveredStockIndex] ?? null;
  }

  protected get hoveredExpenseItem(): DashboardExpenseBreakdownItem | null {
    if (this.hoveredExpenseIndex === null) {
      return null;
    }

    return this.expenseBreakdown[this.hoveredExpenseIndex] ?? null;
  }

  protected getTrendTooltipLeft(index: number, itemCount: number): number {
    const rawPosition = itemCount <= 1 ? 50 : (index / (itemCount - 1)) * 100;

    return Math.min(86, Math.max(14, rawPosition));
  }

  protected getFinanceZoneStart(index: number): number {
    const itemCount = this.financeTrend.length;

    if (itemCount <= 1) {
      return 0;
    }

    const step = 100 / (itemCount - 1);

    return index === 0 ? 0 : (index - 0.5) * step;
  }

  protected getFinanceZoneWidth(index: number): number {
    const itemCount = this.financeTrend.length;

    if (itemCount <= 1) {
      return 100;
    }

    const step = 100 / (itemCount - 1);

    return index === 0 || index === itemCount - 1 ? step / 2 : step;
  }
  protected getFinancePointX(index: number): number {
    const pointCount = this.financeTrend.length - 1;

    return pointCount <= 0 ? 50 : (index / pointCount) * 100;
  }

  protected getFinancePointY(
    point: DashboardFinanceTrendPoint,
    field: 'income' | 'expense'
  ): number {
    const chartHeight = 76;
    const value = Number(point[field]);

    return chartHeight - (value / this.maxFinanceTrendValue) * chartHeight;
  }

  protected getStockTrendAriaLabel(point: DashboardStockTrendPoint): string {
    return `${point.month}: ${point.stock_in} units stocked in, ${point.stock_out} units stocked out, ${point.adjustment} adjusted.`;
  }

  protected getExpenseAriaLabel(item: DashboardExpenseBreakdownItem): string {
    return `${item.category_name}: ${this.formatCurrency(item.amount)}, ${this.getExpenseShare(item)} percent of expenses.`;
  }

  protected getExpenseDashArray(item: DashboardExpenseBreakdownItem): string {
    const total = this.totalExpenseBreakdown;
    const circumference = 2 * Math.PI * 42;

    if (total <= 0) {
      return `0 ${circumference}`;
    }

    const length = (Number(item.amount) / total) * circumference;

    return `${length} ${circumference - length}`;
  }

  protected getExpenseDashOffset(index: number): number {
    const total = this.totalExpenseBreakdown;
    const circumference = 2 * Math.PI * 42;

    if (total <= 0) {
      return 0;
    }

    const previousTotal = this.expenseBreakdown
      .slice(0, index)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return -((previousTotal / total) * circumference);
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      summary: this.dashboardService.getSummary(),
      analytics: this.dashboardService.getAnalytics(this.selectedMonths),
      activity: this.dashboardService.getRecentActivity(5),
      lowStockProducts: this.productService.getLowStockProducts()
    }).subscribe({
      next: ({ summary, analytics, activity, lowStockProducts }) => {
        this.summary = summary;
        this.analytics = analytics;
        this.recentActivity = activity;
        this.lowStockAlertProducts = lowStockProducts;
        this.isLoading = false;
      },
      error: () => {
        this.summary = null;
        this.analytics = null;
        this.recentActivity = null;
        this.lowStockAlertProducts = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to refresh dashboard analytics right now.';
      }
    });
  }
}
