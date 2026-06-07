import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { ProductCategory } from '../../core/models/category.model';
import { Product, ProductCreate, ProductUpdate } from '../../core/models/product.model';
import { Supplier } from '../../core/models/supplier.model';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { SupplierService } from '../../core/services/supplier.service';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-products',
  imports: [
    BadgeComponent,
    EmptyStateComponent,
    FormsModule,
    LoadingStateComponent,
    PageHeaderComponent
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsComponent implements OnInit {
  protected searchTerm = '';
  protected statusFilter = 'all';

  protected products: Product[] = [];
  protected categories: ProductCategory[] = [];
  protected suppliers: Supplier[] = [];

  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';
  protected formError = '';

  protected isFormOpen = false;
  protected editingProduct: Product | null = null;

  protected productName = '';
  protected sku = '';
  protected description = '';
  protected categoryId = '';
  protected supplierId = '';
  protected purchasePrice: number | null = 0;
  protected sellingPrice: number | null = 0;
  protected currentStock: number | null = 0;
  protected lowStockThreshold: number | null = 0;
  protected productIsActive = true;

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.loadPageData();
  }

  protected loadPageData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      products: this.productService.getProducts(),
      categories: this.categoryService.getProductCategories(),
      suppliers: this.supplierService.getSuppliers()
    }).subscribe({
      next: ({ products, categories, suppliers }) => {
        this.products = products;
        this.categories = categories;
        this.suppliers = suppliers;
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.categories = [];
        this.suppliers = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load products.';
      }
    });
  }

  protected openCreateForm(): void {
    this.isFormOpen = true;
    this.editingProduct = null;
    this.productName = '';
    this.sku = '';
    this.description = '';
    this.categoryId = '';
    this.supplierId = '';
    this.purchasePrice = 0;
    this.sellingPrice = 0;
    this.currentStock = 0;
    this.lowStockThreshold = 0;
    this.productIsActive = true;
    this.formError = '';
  }

  protected openEditForm(product: Product): void {
    this.isFormOpen = true;
    this.editingProduct = product;
    this.productName = product.name;
    this.sku = product.sku;
    this.description = product.description || '';
    this.categoryId = product.category_id ? String(product.category_id) : '';
    this.supplierId = product.supplier_id ? String(product.supplier_id) : '';
    this.purchasePrice = Number(product.purchase_price);
    this.sellingPrice = Number(product.selling_price);
    this.currentStock = product.current_stock;
    this.lowStockThreshold = product.low_stock_threshold;
    this.productIsActive = product.is_active;
    this.formError = '';
  }

  protected closeForm(): void {
    this.isFormOpen = false;
    this.editingProduct = null;
    this.formError = '';
  }

  protected handleSubmit(): void {
    this.formError = '';

    if (!this.productName.trim() || !this.sku.trim()) {
      this.formError = 'Product name and SKU are required.';
      return;
    }

    if (
      this.purchasePrice === null ||
      this.sellingPrice === null ||
      this.currentStock === null ||
      this.lowStockThreshold === null ||
      this.purchasePrice < 0 ||
      this.sellingPrice < 0 ||
      this.currentStock < 0 ||
      this.lowStockThreshold < 0
    ) {
      this.formError = 'Prices and stock values must be zero or greater.';
      return;
    }

    this.isSubmitting = true;

    if (this.editingProduct) {
      const payload: ProductUpdate = {
        name: this.productName.trim(),
        sku: this.sku.trim(),
        description: this.description.trim() || null,
        category_id: this.categoryId ? Number(this.categoryId) : null,
        supplier_id: this.supplierId ? Number(this.supplierId) : null,
        purchase_price: this.purchasePrice,
        selling_price: this.sellingPrice,
        current_stock: this.currentStock,
        low_stock_threshold: this.lowStockThreshold,
        is_active: this.productIsActive
      };

      this.productService.updateProduct(this.editingProduct.id, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeForm();
          this.loadPageData();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update product.';
        }
      });

      return;
    }

    const payload: ProductCreate = {
      name: this.productName.trim(),
      sku: this.sku.trim(),
      description: this.description.trim() || null,
      category_id: this.categoryId ? Number(this.categoryId) : null,
      supplier_id: this.supplierId ? Number(this.supplierId) : null,
      purchase_price: this.purchasePrice,
      selling_price: this.sellingPrice,
      current_stock: this.currentStock,
      low_stock_threshold: this.lowStockThreshold
    };

    this.productService.createProduct(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeForm();
        this.loadPageData();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create product.';
      }
    });
  }

  protected deactivateProduct(product: Product): void {
    const confirmed = confirm(`Deactivate product "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.loadPageData();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to deactivate product.';
      }
    });
  }

  protected restoreProduct(product: Product): void {
    const confirmed = confirm(`Restore product "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    this.productService.updateProduct(product.id, { is_active: true }).subscribe({
      next: () => {
        this.loadPageData();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to restore product.';
      }
    });
  }

  protected get activeCategories(): ProductCategory[] {
    return this.categories.filter((category) => category.is_active);
  }

  protected get activeSuppliers(): Supplier[] {
    return this.suppliers.filter((supplier) => supplier.is_active);
  }

  protected getCategoryName(categoryId: number | null): string {
    return this.categories.find((category) => category.id === categoryId)?.name || '—';
  }

  protected getSupplierName(supplierId: number | null): string {
    return this.suppliers.find((supplier) => supplier.id === supplierId)?.name || '—';
  }

  protected get filteredProducts(): Product[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.products.filter((product) => {
      const isLowStock = product.current_stock <= product.low_stock_threshold;

      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        product.sku.toLowerCase().includes(searchValue) ||
        this.getCategoryName(product.category_id).toLowerCase().includes(searchValue) ||
        this.getSupplierName(product.supplier_id).toLowerCase().includes(searchValue);

      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && product.is_active && !isLowStock) ||
        (this.statusFilter === 'low-stock' && product.is_active && isLowStock) ||
        (this.statusFilter === 'inactive' && !product.is_active);

      return matchesSearch && matchesStatus;
    });
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

  protected getProductTone(product: Product): 'success' | 'warning' | 'neutral' {
    if (!product.is_active) {
      return 'neutral';
    }

    if (product.current_stock <= product.low_stock_threshold) {
      return 'warning';
    }

    return 'success';
  }

  protected formatCurrency(value: string | number): string {
    const numericValue = Number(value ?? 0);

    return `৳ ${numericValue.toLocaleString('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }
}
