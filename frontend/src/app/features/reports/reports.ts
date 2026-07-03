import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { DashboardSummary } from '../../core/models/dashboard.model';
import { FinancialSummary, FinancialTransaction } from '../../core/models/finance.model';
import { Product } from '../../core/models/product.model';
import { StockMovement } from '../../core/models/stock.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { FinanceService } from '../../core/services/finance.service';
import { ProductService } from '../../core/services/product.service';
import { StockService } from '../../core/services/stock.service';
import { ToastService } from '../../core/services/toast.service';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

type ReportType = 'products' | 'finance' | 'stock';
type ProductStatusFilter = 'all' | 'active' | 'inactive' | 'low_stock';
type TransactionTypeFilter = 'all' | 'income' | 'expense';
type MovementTypeFilter = 'all' | 'stock_in' | 'stock_out' | 'adjustment';

@Component({
  selector: 'app-reports',
  imports: [
    BadgeComponent,
    EmptyStateComponent,
    FormsModule,
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

  protected selectedReportType: ReportType = 'products';
  protected searchTerm = '';
  protected dateFrom = '';
  protected dateTo = '';
  protected productStatusFilter: ProductStatusFilter = 'all';
  protected transactionTypeFilter: TransactionTypeFilter = 'all';
  protected movementTypeFilter: MovementTypeFilter = 'all';
  protected selectedProductId = '';

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly financeService: FinanceService,
    private readonly productService: ProductService,
    private readonly stockService: StockService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  protected loadReports(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      dashboardSummary: this.dashboardService.getSummary(),
      financialSummary: this.financeService.getSummary(),
      products: this.productService.getProducts(),
      transactions: this.financeService.getTransactions(),
      stockMovements: this.stockService.getStockMovements()
    }).subscribe({
      next: ({
        dashboardSummary,
        financialSummary,
        products,
        transactions,
        stockMovements
      }) => {
        this.dashboardSummary = dashboardSummary;
        this.financialSummary = financialSummary;
        this.products = products;
        this.transactions = transactions;
        this.stockMovements = stockMovements;
        this.isLoading = false;
      },
      error: () => {
        this.dashboardSummary = null;
        this.financialSummary = null;
        this.products = [];
        this.transactions = [];
        this.stockMovements = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load reports.';
      }
    });
  }
  protected resetReportFilters(): void {
    this.searchTerm = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.productStatusFilter = 'all';
    this.transactionTypeFilter = 'all';
    this.movementTypeFilter = 'all';
    this.selectedProductId = '';
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

  protected get filteredProducts(): Product[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.products.filter((product) => {
      const matchesSearch =
        !searchValue ||
        product.name.toLowerCase().includes(searchValue) ||
        product.sku.toLowerCase().includes(searchValue) ||
        String(product.id).includes(searchValue);

      const matchesStatus =
        this.productStatusFilter === 'all' ||
        (this.productStatusFilter === 'active' && product.is_active) ||
        (this.productStatusFilter === 'inactive' && !product.is_active) ||
        (
          this.productStatusFilter === 'low_stock' &&
          product.is_active &&
          product.current_stock <= product.low_stock_threshold
        );

      return matchesSearch && matchesStatus;
    });
  }

  protected get filteredTransactions(): FinancialTransaction[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.transactions.filter((transaction) => {
      const matchesSearch =
        !searchValue ||
        transaction.title.toLowerCase().includes(searchValue) ||
        String(transaction.amount).toLowerCase().includes(searchValue) ||
        (transaction.description || '').toLowerCase().includes(searchValue);

      const matchesType =
        this.transactionTypeFilter === 'all' ||
        transaction.transaction_type === this.transactionTypeFilter;

      const matchesDate = this.isWithinDateRange(transaction.transaction_date);

      return matchesSearch && matchesType && matchesDate;
    });
  }

  protected get filteredStockMovements(): StockMovement[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.stockMovements.filter((movement) => {
      const productName = this.getProductName(movement.product_id).toLowerCase();

      const matchesSearch =
        !searchValue ||
        productName.includes(searchValue) ||
        String(movement.product_id).includes(searchValue) ||
        movement.movement_type.toLowerCase().includes(searchValue) ||
        (movement.reason || '').toLowerCase().includes(searchValue);

      const matchesProduct =
        !this.selectedProductId ||
        movement.product_id === Number(this.selectedProductId);

      const matchesType =
        this.movementTypeFilter === 'all' ||
        movement.movement_type === this.movementTypeFilter;

      const matchesDate = this.isWithinDateRange(movement.created_at);

      return matchesSearch && matchesProduct && matchesType && matchesDate;
    });
  }

  protected get activeReportTitle(): string {
    if (this.selectedReportType === 'finance') {
      return 'Finance Report Preview';
    }

    if (this.selectedReportType === 'stock') {
      return 'Stock Movement Report Preview';
    }

    return 'Product Report Preview';
  }

  protected get activeReportDescription(): string {
    if (this.selectedReportType === 'finance') {
      return `${this.filteredTransactions.length} finance records matched your filters.`;
    }

    if (this.selectedReportType === 'stock') {
      return `${this.filteredStockMovements.length} stock movement records matched your filters.`;
    }

    return `${this.filteredProducts.length} product records matched your filters.`;
  }

  protected get activeReportTotalCount(): number {
    if (this.selectedReportType === 'finance') {
      return this.filteredTransactions.length;
    }

    if (this.selectedReportType === 'stock') {
      return this.filteredStockMovements.length;
    }

    return this.filteredProducts.length;
  }

  protected get filteredIncomeTotal(): number {
    return this.filteredTransactions
      .filter((transaction) => transaction.transaction_type === 'income')
      .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  }

  protected get filteredExpenseTotal(): number {
    return this.filteredTransactions
      .filter((transaction) => transaction.transaction_type === 'expense')
      .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  }

  protected get filteredNetBalance(): number {
    return this.filteredIncomeTotal - this.filteredExpenseTotal;
  }

  protected get filteredActiveProductCount(): number {
    return this.filteredProducts.filter((product) => product.is_active).length;
  }

  protected get filteredLowStockProductCount(): number {
    return this.filteredProducts.filter((product) => {
      return product.is_active && product.current_stock <= product.low_stock_threshold;
    }).length;
  }

  protected get filteredStockInTotal(): number {
    return this.filteredStockMovements
      .filter((movement) => movement.movement_type === 'stock_in')
      .reduce((total, movement) => total + Number(movement.quantity || 0), 0);
  }

  protected get filteredStockOutTotal(): number {
    return this.filteredStockMovements
      .filter((movement) => movement.movement_type === 'stock_out')
      .reduce((total, movement) => total + Number(movement.quantity || 0), 0);
  }

  protected get filteredAdjustmentTotal(): number {
    return this.filteredStockMovements
      .filter((movement) => movement.movement_type === 'adjustment')
      .length;
  }

  protected formatCurrency(value: string | number | null | undefined): string {
    const numericValue = Number(value ?? 0);
    const taka = String.fromCharCode(0x09F3);

    return `${taka} ${numericValue.toLocaleString('en-BD', {
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

  protected getProductStatus(product: Product): string {
    if (!product.is_active) {
      return 'Inactive';
    }

    if (product.current_stock <= product.low_stock_threshold) {
      return 'Low Stock';
    }

    return 'Active';
  }

  protected getProductStatusTone(product: Product): 'success' | 'warning' | 'neutral' {
    if (!product.is_active) {
      return 'neutral';
    }

    if (product.current_stock <= product.low_stock_threshold) {
      return 'warning';
    }

    return 'success';
  }

  protected getProductName(productId: number): string {
    return this.products.find((product) => product.id === productId)?.name || `Product #${productId}`;
  }

  protected exportProductsCsv(): void {
    const rows = [
      ['ID', 'Name', 'SKU', 'Stock', 'Low Stock Threshold', 'Selling Price', 'Status'],
      ...this.filteredProducts.map((product) => [
        product.id,
        product.name,
        product.sku,
        product.current_stock,
        product.low_stock_threshold,
        product.selling_price,
        this.getProductStatus(product)
      ])
    ];

    this.downloadCsv('stockflow-products-report.csv', rows);
    this.toastService.success('Products exported', 'Filtered products CSV report was downloaded successfully.');
  }

  protected async exportProductsExcel(): Promise<void> {
    const rows = [
      ['ID', 'Name', 'SKU', 'Stock', 'Low Stock Threshold', 'Selling Price', 'Status'],
      ...this.filteredProducts.map((product) => [
        product.id,
        product.name,
        product.sku,
        product.current_stock,
        product.low_stock_threshold,
        product.selling_price,
        this.getProductStatus(product)
      ])
    ];

    await this.downloadExcel('stockflow-products-report.xlsx', 'Products', rows);
    this.toastService.success('Products exported', 'Filtered products Excel report was downloaded successfully.');
  }

  protected async exportProductsPdf(): Promise<void> {
    const headers = ['ID', 'Name', 'SKU', 'Stock', 'Threshold', 'Selling Price', 'Status'];
    const rows = this.filteredProducts.map((product) => [
      product.id,
      product.name,
      product.sku,
      product.current_stock,
      product.low_stock_threshold,
      this.formatCurrency(product.selling_price),
      this.getProductStatus(product)
    ]);

    await this.downloadPdf(
      'stockflow-products-report.pdf',
      'Product Inventory Report',
      headers,
      rows,
      [
        `Matched Records: ${this.filteredProducts.length}`,
        `Status Filter: ${this.formatFilterValue(this.productStatusFilter)}`,
        `Search: ${this.searchTerm || 'All'}`
      ]
    );

    this.toastService.success('Products exported', 'Filtered products PDF report was downloaded successfully.');
  }

  protected async exportProductsWord(): Promise<void> {
    const headers = ['ID', 'Name', 'SKU', 'Stock', 'Threshold', 'Selling Price', 'Status'];
    const rows = this.filteredProducts.map((product) => [
      product.id,
      product.name,
      product.sku,
      product.current_stock,
      product.low_stock_threshold,
      this.formatCurrency(product.selling_price),
      this.getProductStatus(product)
    ]);

    await this.downloadWord(
      'stockflow-products-report.docx',
      'Product Inventory Report',
      headers,
      rows,
      [
        `Matched Records: ${this.filteredProducts.length}`,
        `Status Filter: ${this.formatFilterValue(this.productStatusFilter)}`,
        `Search: ${this.searchTerm || 'All'}`
      ]
    );

    this.toastService.success('Products exported', 'Filtered products Word report was downloaded successfully.');
  }

  protected exportTransactionsCsv(): void {
    const rows = [
      ['ID', 'Type', 'Title', 'Amount', 'Date', 'Description'],
      ...this.filteredTransactions.map((transaction) => [
        transaction.id,
        transaction.transaction_type,
        transaction.title,
        transaction.amount,
        transaction.transaction_date,
        transaction.description || ''
      ])
    ];

    this.downloadCsv('stockflow-finance-report.csv', rows);
    this.toastService.success('Finance exported', 'Filtered finance CSV report was downloaded successfully.');
  }

  protected async exportTransactionsExcel(): Promise<void> {
    const rows = [
      ['ID', 'Type', 'Title', 'Amount', 'Date', 'Description'],
      ...this.filteredTransactions.map((transaction) => [
        transaction.id,
        transaction.transaction_type,
        transaction.title,
        transaction.amount,
        transaction.transaction_date,
        transaction.description || ''
      ])
    ];

    await this.downloadExcel('stockflow-finance-report.xlsx', 'Finance', rows);
    this.toastService.success('Finance exported', 'Filtered finance Excel report was downloaded successfully.');
  }

  protected async exportTransactionsPdf(): Promise<void> {
    const headers = ['ID', 'Type', 'Title', 'Amount', 'Date', 'Description'];
    const rows = this.filteredTransactions.map((transaction) => [
      transaction.id,
      this.formatMovementType(transaction.transaction_type),
      transaction.title,
      this.formatCurrency(transaction.amount),
      transaction.transaction_date,
      transaction.description || ''
    ]);

    await this.downloadPdf(
      'stockflow-finance-report.pdf',
      'Finance Transaction Report',
      headers,
      rows,
      [
        `Matched Records: ${this.filteredTransactions.length}`,
        `Transaction Type: ${this.formatFilterValue(this.transactionTypeFilter)}`,
        `Date Range: ${this.formatDateRange()}`,
        `Income: ${this.formatCurrency(this.filteredIncomeTotal)}`,
        `Expense: ${this.formatCurrency(this.filteredExpenseTotal)}`,
        `Net: ${this.formatCurrency(this.filteredNetBalance)}`
      ]
    );

    this.toastService.success('Finance exported', 'Filtered finance PDF report was downloaded successfully.');
  }

  protected async exportTransactionsWord(): Promise<void> {
    const headers = ['ID', 'Type', 'Title', 'Amount', 'Date', 'Description'];
    const rows = this.filteredTransactions.map((transaction) => [
      transaction.id,
      this.formatMovementType(transaction.transaction_type),
      transaction.title,
      this.formatCurrency(transaction.amount),
      transaction.transaction_date,
      transaction.description || ''
    ]);

    await this.downloadWord(
      'stockflow-finance-report.docx',
      'Finance Transaction Report',
      headers,
      rows,
      [
        `Matched Records: ${this.filteredTransactions.length}`,
        `Transaction Type: ${this.formatFilterValue(this.transactionTypeFilter)}`,
        `Date Range: ${this.formatDateRange()}`,
        `Income: ${this.formatCurrency(this.filteredIncomeTotal)}`,
        `Expense: ${this.formatCurrency(this.filteredExpenseTotal)}`,
        `Net: ${this.formatCurrency(this.filteredNetBalance)}`
      ]
    );

    this.toastService.success('Finance exported', 'Filtered finance Word report was downloaded successfully.');
  }

  protected exportStockMovementsCsv(): void {
    const rows = [
      ['ID', 'Product', 'Product ID', 'Type', 'Quantity', 'Previous Stock', 'New Stock', 'Reason', 'Created At'],
      ...this.filteredStockMovements.map((movement) => [
        movement.id,
        this.getProductName(movement.product_id),
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
    this.toastService.success('Stock movements exported', 'Filtered stock movements CSV report was downloaded successfully.');
  }

  protected async exportStockMovementsExcel(): Promise<void> {
    const rows = [
      ['ID', 'Product', 'Product ID', 'Type', 'Quantity', 'Previous Stock', 'New Stock', 'Reason', 'Created At'],
      ...this.filteredStockMovements.map((movement) => [
        movement.id,
        this.getProductName(movement.product_id),
        movement.product_id,
        movement.movement_type,
        movement.quantity,
        movement.previous_stock,
        movement.new_stock,
        movement.reason || '',
        movement.created_at
      ])
    ];

    await this.downloadExcel('stockflow-stock-movements-report.xlsx', 'Stock Movements', rows);
    this.toastService.success('Stock movements exported', 'Filtered stock movements Excel report was downloaded successfully.');
  }

  protected async exportStockMovementsPdf(): Promise<void> {
    const headers = ['ID', 'Product', 'Type', 'Quantity', 'Previous', 'New', 'Reason', 'Created At'];
    const rows = this.filteredStockMovements.map((movement) => [
      movement.id,
      this.getProductName(movement.product_id),
      this.formatMovementType(movement.movement_type),
      movement.quantity,
      movement.previous_stock,
      movement.new_stock,
      movement.reason || '',
      movement.created_at
    ]);

    await this.downloadPdf(
      'stockflow-stock-movements-report.pdf',
      'Stock Movement Report',
      headers,
      rows,
      [
        `Matched Records: ${this.filteredStockMovements.length}`,
        `Product: ${this.selectedProductId ? this.getProductName(Number(this.selectedProductId)) : 'All Products'}`,
        `Movement Type: ${this.formatFilterValue(this.movementTypeFilter)}`,
        `Date Range: ${this.formatDateRange()}`,
        `Total Stock In: ${this.filteredStockInTotal}`,
        `Total Stock Out: ${this.filteredStockOutTotal}`,
        `Adjustments: ${this.filteredAdjustmentTotal}`
      ]
    );

    this.toastService.success('Stock movements exported', 'Filtered stock movements PDF report was downloaded successfully.');
  }

  protected async exportStockMovementsWord(): Promise<void> {
    const headers = ['ID', 'Product', 'Type', 'Quantity', 'Previous', 'New', 'Reason', 'Created At'];
    const rows = this.filteredStockMovements.map((movement) => [
      movement.id,
      this.getProductName(movement.product_id),
      this.formatMovementType(movement.movement_type),
      movement.quantity,
      movement.previous_stock,
      movement.new_stock,
      movement.reason || '',
      movement.created_at
    ]);

    await this.downloadWord(
      'stockflow-stock-movements-report.docx',
      'Stock Movement Report',
      headers,
      rows,
      [
        `Matched Records: ${this.filteredStockMovements.length}`,
        `Product: ${this.selectedProductId ? this.getProductName(Number(this.selectedProductId)) : 'All Products'}`,
        `Movement Type: ${this.formatFilterValue(this.movementTypeFilter)}`,
        `Date Range: ${this.formatDateRange()}`,
        `Total Stock In: ${this.filteredStockInTotal}`,
        `Total Stock Out: ${this.filteredStockOutTotal}`,
        `Adjustments: ${this.filteredAdjustmentTotal}`
      ]
    );

    this.toastService.success('Stock movements exported', 'Filtered stock movements Word report was downloaded successfully.');
  }


  protected formatReportDate(value: string): string {
    const dateOnly = value.slice(0, 10);
    const [year, month, day] = dateOnly.split('-').map(Number);

    if (!year || !month || !day) {
      return value;
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(year, month - 1, day));
  }
  private isWithinDateRange(dateValue: string): boolean {
    if (!dateValue) {
      return true;
    }

    const dateOnly = dateValue.slice(0, 10);

    if (this.dateFrom && dateOnly < this.dateFrom) {
      return false;
    }

    if (this.dateTo && dateOnly > this.dateTo) {
      return false;
    }

    return true;
  }

  private formatDateRange(): string {
    if (this.dateFrom && this.dateTo) {
      return `${this.dateFrom} to ${this.dateTo}`;
    }

    if (this.dateFrom) {
      return `From ${this.dateFrom}`;
    }

    if (this.dateTo) {
      return `Until ${this.dateTo}`;
    }

    return 'All Time';
  }

  private formatFilterValue(value: string): string {
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  private async downloadWord(
    filename: string,
    reportTitle: string,
    headers: string[],
    rows: Array<Array<string | number>>,
    summaryLines: string[]
  ): Promise<void> {
    const {
      AlignmentType,
      Document,
      Footer,
      Header,
      Packer,
      Paragraph,
      Table,
      TableCell,
      TableRow,
      TextRun,
      WidthType
    } = await import('docx');

    const generatedAt = new Date().toLocaleString('en-BD');

    const headerRow = new TableRow({
      children: headers.map((header) =>
        new TableCell({
          shading: { fill: '2563EB' },
          width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: header,
                  bold: true,
                  color: 'FFFFFF',
                  size: 18
                })
              ]
            })
          ]
        })
      )
    });

    const dataRows = rows.map((row) =>
      new TableRow({
        children: row.map((cell) =>
          new TableCell({
            width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: String(cell ?? ''),
                    size: 18,
                    color: '111827'
                  })
                ]
              })
            ]
          })
        )
      })
    );

    const document = new Document({
      sections: [
        {
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'StockFlow',
                      bold: true,
                      size: 24,
                      color: '0F172A'
                    }),
                    new TextRun({
                      text: ' | Inventory & Finance Workspace',
                      size: 18,
                      color: '64748B'
                    })
                  ]
                })
              ]
            })
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'Generated by StockFlow | Internal Business Report',
                      size: 16,
                      color: '6B7280'
                    })
                  ]
                })
              ]
            })
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: reportTitle,
                  bold: true,
                  size: 32,
                  color: '111827'
                })
              ],
              spacing: { after: 160 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Generated: ${generatedAt}`,
                  size: 18,
                  color: '475569'
                })
              ],
              spacing: { after: 180 }
            }),
            ...summaryLines.map((line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 18,
                    color: '334155'
                  })
                ],
                spacing: { after: 80 }
              })
            ),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Report Data',
                  bold: true,
                  size: 24,
                  color: '111827'
                })
              ],
              spacing: { before: 180, after: 120 }
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [headerRow, ...dataRows]
            })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(document);
    this.downloadBlob(filename, blob);
  }

  private async downloadPdf(
    filename: string,
    reportTitle: string,
    headers: string[],
    rows: Array<Array<string | number>>,
    summaryLines: string[]
  ): Promise<void> {
    const jsPdfModule = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');

    const doc = new jsPdfModule.jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const generatedAt = new Date().toLocaleString('en-BD');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('StockFlow', 14, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Inventory & Finance Workspace', 14, 19);

    doc.setFontSize(10);
    doc.text(`Generated: ${generatedAt}`, pageWidth - 14, 12, { align: 'right' });

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text(reportTitle, 14, 39);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');

    let summaryY = 47;
    summaryLines.forEach((line) => {
      doc.text(line, 14, summaryY);
      summaryY += 5;
    });

    autoTableModule.default(doc, {
      head: [headers],
      body: rows,
      startY: summaryY + 3,
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: {
        left: 14,
        right: 14
      },
      didDrawPage: () => {
        const currentPage = doc.getNumberOfPages();

        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('Generated by StockFlow | Internal Business Report', 14, pageHeight - 10);
        doc.text(`Page ${currentPage}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
      }
    });

    doc.save(filename);
  }

  private async downloadExcel(filename: string, sheetName: string, rows: Array<Array<string | number>>): Promise<void> {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filename);
  }

  private downloadBlob(filename: string, blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
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
