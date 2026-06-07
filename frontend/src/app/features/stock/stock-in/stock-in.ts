import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { StockService } from '../../../core/services/stock.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-stock-in',
  imports: [FormsModule, PageHeaderComponent, RouterLink],
  templateUrl: './stock-in.html',
  styleUrl: './stock-in.scss'
})
export class StockInComponent implements OnInit {
  protected products: Product[] = [];
  protected productId = '';
  protected quantity: number | null = null;
  protected reason = '';
  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';
  protected successMessage = '';

  constructor(
    private readonly productService: ProductService,
    private readonly stockService: StockService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  protected loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.filter((product) => product.is_active);
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load products.';
      }
    });
  }

  protected handleSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.productId || !this.quantity || this.quantity <= 0) {
      this.errorMessage = 'Please select a product and enter a valid quantity.';
      return;
    }

    this.isSubmitting = true;

    this.stockService.createStockIn({
      product_id: Number(this.productId),
      quantity: this.quantity,
      reason: this.reason || null
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Stock in recorded successfully.';

        setTimeout(() => {
          this.router.navigate(['/app/stock/movements']);
        }, 700);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.detail || 'Unable to record stock in.';
      }
    });
  }
}

