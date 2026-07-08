import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Info,
  LucideAngularModule,
  Package,
  RefreshCw
} from 'lucide-angular';

import { Product } from '../../../core/models/product.model';
import { Warehouse } from '../../../core/models/warehouse.model';
import { ProductService } from '../../../core/services/product.service';
import { StockService } from '../../../core/services/stock.service';
import { ToastService } from '../../../core/services/toast.service';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-stock-adjustment',
  imports: [
    EmptyStateComponent,
    FormsModule,
    LoadingStateComponent,
    LucideAngularModule,
    PageHeaderComponent,
    RouterLink
  ],
  templateUrl: './stock-adjustment.html',
  styleUrl: './stock-adjustment.scss'
})
export class StockAdjustmentComponent implements OnInit {
  protected products: Product[] = [];
  protected warehouses: Warehouse[] = [];
  protected productId = '';
  protected warehouseId = '';
  protected newStock: number | null = null;
  protected reason = '';
  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';
  protected successMessage = '';

  protected readonly adjustmentIcon = RefreshCw;
  protected readonly movementsIcon = ClipboardList;
  protected readonly productIcon = Package;
  protected readonly infoIcon = Info;
  protected readonly checkIcon = CheckCircle2;
  protected readonly alertIcon = CircleAlert;

  constructor(
    private readonly productService: ProductService,
    private readonly stockService: StockService,
    private readonly warehouseService: WarehouseService,
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadFormData();
  }

  protected loadFormData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      products: this.productService.getProducts(),
      warehouses: this.warehouseService.getWarehouses(false)
    }).subscribe({
      next: ({ products, warehouses }) => {
        this.products = products.filter((product) => product.is_active);
        this.warehouses = warehouses.filter((warehouse) => warehouse.is_active);
        this.warehouseId = this.getDefaultWarehouseId();
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.warehouses = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load products and warehouses.';
      }
    });
  }

  protected get selectedProduct(): Product | null {
    return this.products.find((product) => product.id === Number(this.productId)) || null;
  }

  protected get selectedWarehouse(): Warehouse | null {
    return this.warehouses.find((warehouse) => warehouse.id === Number(this.warehouseId)) || null;
  }

  protected get stockDifference(): number | null {
    if (!this.selectedProduct || this.newStock === null) {
      return null;
    }

    return this.newStock - this.selectedProduct.current_stock;
  }

  protected get differenceLabel(): string {
    if (this.stockDifference === null) {
      return '?';
    }

    return this.stockDifference > 0
      ? `+${this.stockDifference}`
      : String(this.stockDifference);
  }

  protected handleSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.productId || !this.warehouseId || this.newStock === null || this.newStock < 0) {
      this.errorMessage = 'Please select a product, warehouse, and valid stock quantity.';
      return;
    }

    this.isSubmitting = true;

    this.stockService.createStockAdjustment({
      product_id: Number(this.productId),
      warehouse_id: Number(this.warehouseId),
      new_stock: this.newStock,
      reason: this.reason || null
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Stock adjustment saved successfully.';
        this.toastService.success('Stock adjusted', 'Warehouse stock was adjusted successfully.');

        setTimeout(() => {
          this.router.navigate(['/app/stock/movements']);
        }, 700);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.detail || 'Unable to save stock adjustment.';
        this.toastService.error('Adjustment failed', this.errorMessage);
      }
    });
  }

  private getDefaultWarehouseId(): string {
    const mainWarehouse = this.warehouses.find((warehouse) => warehouse.code === 'MAIN');
    const defaultWarehouse = mainWarehouse || this.warehouses[0];

    return defaultWarehouse ? String(defaultWarehouse.id) : '';
  }
}
