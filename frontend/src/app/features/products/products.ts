import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
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
  protected isLoading = false;
  protected errorMessage = '';

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  protected loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load products.';
      }
    });
  }

  protected get filteredProducts(): Product[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        product.sku.toLowerCase().includes(searchValue) ||
        String(product.category_id ?? '').includes(searchValue) ||
        String(product.supplier_id ?? '').includes(searchValue);

      const isLowStock = product.current_stock <= product.low_stock_threshold;

      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && product.is_active && !isLowStock) ||
        (this.statusFilter === 'low-stock' && isLowStock) ||
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
