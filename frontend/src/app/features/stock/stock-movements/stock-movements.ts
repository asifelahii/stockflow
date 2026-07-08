import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import {
  ArrowDown,
  ArrowUp,
  ClipboardList,
  LucideAngularModule,
  Package,
  RefreshCw,
  Search,
  SlidersHorizontal
} from 'lucide-angular';

import { Product } from '../../../core/models/product.model';
import { StockMovement } from '../../../core/models/stock.model';
import { Warehouse } from '../../../core/models/warehouse.model';
import { ProductService } from '../../../core/services/product.service';
import { StockService } from '../../../core/services/stock.service';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-stock-movements',
  imports: [
    BadgeComponent,
    EmptyStateComponent,
    FormsModule,
    LoadingStateComponent,
    LucideAngularModule,
    PageHeaderComponent
  ],
  templateUrl: './stock-movements.html',
  styleUrl: './stock-movements.scss'
})
export class StockMovementsComponent implements OnInit {
  protected searchTerm = '';
  protected typeFilter = 'all';
  protected warehouseFilter = 'all';
  protected movements: StockMovement[] = [];
  protected products: Product[] = [];
  protected warehouses: Warehouse[] = [];
  protected isLoading = false;
  protected errorMessage = '';

  protected readonly movementsIcon = ClipboardList;
  protected readonly searchIcon = Search;
  protected readonly filterIcon = SlidersHorizontal;
  protected readonly stockInIcon = ArrowDown;
  protected readonly stockOutIcon = ArrowUp;
  protected readonly adjustmentIcon = RefreshCw;
  protected readonly productIcon = Package;

  constructor(
    private readonly stockService: StockService,
    private readonly productService: ProductService,
    private readonly warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    this.loadMovements();
  }

  protected loadMovements(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      movements: this.stockService.getStockMovements(),
      products: this.productService.getProducts(),
      warehouses: this.warehouseService.getWarehouses()
    }).subscribe({
      next: ({ movements, products, warehouses }) => {
        this.movements = movements;
        this.products = products;
        this.warehouses = warehouses;
        this.isLoading = false;
      },
      error: () => {
        this.movements = [];
        this.products = [];
        this.warehouses = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load stock movements.';
      }
    });
  }

  protected clearFilters(): void {
    this.searchTerm = '';
    this.typeFilter = 'all';
    this.warehouseFilter = 'all';
  }

  protected get filteredMovements(): StockMovement[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.movements.filter((movement) => {
      const productName = this.getProductName(movement.product_id).toLowerCase();
      const formattedType = this.formatMovementType(movement.movement_type).toLowerCase();
      const warehouseName = this.getWarehouseName(movement.warehouse_id).toLowerCase();
      const warehouseCode = this.getWarehouseCode(movement.warehouse_id).toLowerCase();

      const matchesSearch =
        productName.includes(searchValue) ||
        warehouseName.includes(searchValue) ||
        warehouseCode.includes(searchValue) ||
        String(movement.product_id).includes(searchValue) ||
        formattedType.includes(searchValue) ||
        String(movement.quantity).includes(searchValue) ||
        (movement.reason || '').toLowerCase().includes(searchValue);

      const matchesType =
        this.typeFilter === 'all' || movement.movement_type === this.typeFilter;

      const matchesWarehouse =
        this.warehouseFilter === 'all' || movement.warehouse_id === Number(this.warehouseFilter);

      return matchesSearch && matchesType && matchesWarehouse;
    });
  }

  protected get stockInCount(): number {
    return this.movements.filter((movement) => movement.movement_type === 'stock_in').length;
  }

  protected get stockOutCount(): number {
    return this.movements.filter((movement) => movement.movement_type === 'stock_out').length;
  }

  protected get adjustmentCount(): number {
    return this.movements.filter((movement) => movement.movement_type === 'adjustment').length;
  }

  protected getProductName(productId: number): string {
    return this.products.find((product) => product.id === productId)?.name || `Product #${productId}`;
  }

  protected getProductSku(productId: number): string {
    return this.products.find((product) => product.id === productId)?.sku || `ID ${productId}`;
  }

  protected getWarehouseName(warehouseId: number): string {
    return this.warehouses.find((warehouse) => warehouse.id === warehouseId)?.name || `Warehouse #${warehouseId}`;
  }

  protected getWarehouseCode(warehouseId: number): string {
    return this.warehouses.find((warehouse) => warehouse.id === warehouseId)?.code || `ID ${warehouseId}`;
  }

  protected formatMovementType(type: string): string {
    return type
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  protected formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  protected formatTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  protected formatQuantity(movement: StockMovement): string {
    const quantity = Math.abs(movement.quantity);

    if (movement.movement_type === 'stock_out') {
      return `-${quantity}`;
    }

    if (movement.movement_type === 'stock_in') {
      return `+${quantity}`;
    }

    return String(movement.quantity);
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

  protected getMovementIcon(type: string): any {
    if (type === 'stock_in') {
      return this.stockInIcon;
    }

    if (type === 'stock_out') {
      return this.stockOutIcon;
    }

    return this.adjustmentIcon;
  }
}
