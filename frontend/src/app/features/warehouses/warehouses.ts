import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CheckCircle2,
  CircleAlert,
  Hash,
  LucideAngularModule,
  MapPin,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2
} from 'lucide-angular';
import { forkJoin } from 'rxjs';

import { Product } from '../../core/models/product.model';
import { Warehouse, WarehouseInventory } from '../../core/models/warehouse.model';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { WarehouseService } from '../../core/services/warehouse.service';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

interface WarehouseFormState {
  name: string;
  code: string;
  address: string;
  is_active: boolean;
}

@Component({
  selector: 'app-warehouses',
  imports: [
    BadgeComponent,
    EmptyStateComponent,
    FormsModule,
    LoadingStateComponent,
    LucideAngularModule,
    PageHeaderComponent
  ],
  templateUrl: './warehouses.html',
  styleUrl: './warehouses.scss'
})
export class WarehousesComponent implements OnInit {
  protected warehouses: Warehouse[] = [];
  protected products: Product[] = [];
  protected selectedWarehouseId: number | null = null;
  protected selectedInventory: WarehouseInventory[] = [];

  protected searchTerm = '';
  protected includeInactive = true;
  protected isLoading = false;
  protected isSaving = false;
  protected isLoadingInventory = false;
  protected errorMessage = '';
  protected successMessage = '';
  protected editingWarehouseId: number | null = null;

  protected form: WarehouseFormState = this.getEmptyForm();

  protected readonly warehouseIcon = Package;
  protected readonly addIcon = Plus;
  protected readonly editIcon = Pencil;
  protected readonly deleteIcon = Trash2;
  protected readonly refreshIcon = RefreshCw;
  protected readonly searchIcon = Search;
  protected readonly hashIcon = Hash;
  protected readonly addressIcon = MapPin;
  protected readonly checkIcon = CheckCircle2;
  protected readonly alertIcon = CircleAlert;

  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly productService: ProductService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPageData();
  }

  protected loadPageData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      warehouses: this.warehouseService.getWarehouses(this.includeInactive),
      products: this.productService.getProducts()
    }).subscribe({
      next: ({ warehouses, products }) => {
        this.warehouses = warehouses;
        this.products = products;
        this.isLoading = false;

        if (!this.selectedWarehouseId && warehouses.length) {
          const mainWarehouse = warehouses.find((warehouse) => warehouse.code === 'MAIN');
          this.selectWarehouse(mainWarehouse || warehouses[0]);
        } else if (this.selectedWarehouseId) {
          const selectedWarehouse = warehouses.find(
            (warehouse) => warehouse.id === this.selectedWarehouseId
          );

          if (selectedWarehouse) {
            this.loadWarehouseInventory(selectedWarehouse.id);
          }
        }
      },
      error: () => {
        this.warehouses = [];
        this.products = [];
        this.selectedInventory = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load warehouses.';
      }
    });
  }

  protected get filteredWarehouses(): Warehouse[] {
    const query = this.searchTerm.trim().toLowerCase();

    return this.warehouses.filter((warehouse) => {
      const matchesStatus = this.includeInactive || warehouse.is_active;
      const matchesSearch =
        warehouse.name.toLowerCase().includes(query) ||
        warehouse.code.toLowerCase().includes(query) ||
        (warehouse.address || '').toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }

  protected get selectedWarehouse(): Warehouse | null {
    if (!this.selectedWarehouseId) {
      return null;
    }

    return this.warehouses.find((warehouse) => warehouse.id === this.selectedWarehouseId) || null;
  }

  protected get activeWarehouseCount(): number {
    return this.warehouses.filter((warehouse) => warehouse.is_active).length;
  }

  protected get totalInventoryQuantity(): number {
    return this.selectedInventory.reduce(
      (total, item) => total + item.quantity_on_hand,
      0
    );
  }

  protected selectWarehouse(warehouse: Warehouse): void {
    this.selectedWarehouseId = warehouse.id;
    this.loadWarehouseInventory(warehouse.id);
  }

  protected startCreate(): void {
    this.editingWarehouseId = null;
    this.form = this.getEmptyForm();
    this.errorMessage = '';
    this.successMessage = '';
  }

  protected startEdit(warehouse: Warehouse): void {
    this.editingWarehouseId = warehouse.id;
    this.form = {
      name: warehouse.name,
      code: warehouse.code,
      address: warehouse.address || '',
      is_active: warehouse.is_active
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  protected cancelEdit(): void {
    this.editingWarehouseId = null;
    this.form = this.getEmptyForm();
    this.errorMessage = '';
    this.successMessage = '';
  }

  protected saveWarehouse(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const name = this.form.name.trim();
    const code = this.form.code.trim().toUpperCase().replaceAll(' ', '-');
    const address = this.form.address.trim();

    if (!name || !code) {
      this.errorMessage = 'Warehouse name and code are required.';
      return;
    }

    this.isSaving = true;

    const payload = {
      name,
      code,
      address: address || null,
      is_active: this.form.is_active
    };

    const request$ = this.editingWarehouseId
      ? this.warehouseService.updateWarehouse(this.editingWarehouseId, payload)
      : this.warehouseService.createWarehouse(payload);

    request$.subscribe({
      next: (warehouse) => {
        this.isSaving = false;
        this.successMessage = this.editingWarehouseId
          ? 'Warehouse updated successfully.'
          : 'Warehouse created successfully.';

        this.toastService.success(
          this.editingWarehouseId ? 'Warehouse updated' : 'Warehouse created',
          `${warehouse.name} is ready for stock operations.`
        );

        this.editingWarehouseId = null;
        this.form = this.getEmptyForm();
        this.selectedWarehouseId = warehouse.id;
        this.loadPageData();
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error?.error?.detail || 'Unable to save warehouse.';
        this.toastService.error('Warehouse save failed', this.errorMessage);
      }
    });
  }

  protected deactivateWarehouse(warehouse: Warehouse): void {
    if (warehouse.code === 'MAIN') {
      this.errorMessage = 'Main Warehouse cannot be deactivated.';
      return;
    }

    const confirmed = window.confirm(`Deactivate ${warehouse.name}?`);

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    this.warehouseService.deactivateWarehouse(warehouse.id).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Warehouse deactivated successfully.';
        this.toastService.success('Warehouse deactivated', `${warehouse.name} was deactivated.`);
        this.loadPageData();
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error?.error?.detail || 'Unable to deactivate warehouse.';
        this.toastService.error('Deactivate failed', this.errorMessage);
      }
    });
  }

  protected getProductName(productId: number): string {
    return this.products.find((product) => product.id === productId)?.name || `Product #${productId}`;
  }

  protected getProductSku(productId: number): string {
    return this.products.find((product) => product.id === productId)?.sku || `ID ${productId}`;
  }

  protected getStockTone(item: WarehouseInventory): 'success' | 'danger' | 'warning' | 'neutral' {
    if (item.quantity_on_hand <= 0) {
      return 'danger';
    }

    if (
      item.low_stock_threshold > 0 &&
      item.quantity_on_hand <= item.low_stock_threshold
    ) {
      return 'warning';
    }

    return 'success';
  }

  private loadWarehouseInventory(warehouseId: number): void {
    this.isLoadingInventory = true;

    this.warehouseService.getWarehouseInventory(warehouseId).subscribe({
      next: (inventory) => {
        this.selectedInventory = inventory;
        this.isLoadingInventory = false;
      },
      error: () => {
        this.selectedInventory = [];
        this.isLoadingInventory = false;
        this.toastService.error('Inventory load failed', 'Unable to load warehouse inventory.');
      }
    });
  }

  private getEmptyForm(): WarehouseFormState {
    return {
      name: '',
      code: '',
      address: '',
      is_active: true
    };
  }
}
