import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ArrowUp,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Info,
  LucideAngularModule,
  Package,
  TriangleAlert
} from 'lucide-angular';

import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { StockService } from '../../../core/services/stock.service';
import { ToastService } from '../../../core/services/toast.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-stock-out',
  imports: [
    EmptyStateComponent,
    FormsModule,
    LoadingStateComponent,
    LucideAngularModule,
    PageHeaderComponent,
    RouterLink
  ],
  templateUrl: './stock-out.html',
  styleUrl: './stock-out.scss'
})
export class StockOutComponent implements OnInit {
  protected products: Product[] = [];
  protected productId = '';
  protected quantity: number | null = null;
  protected reason = '';
  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';
  protected successMessage = '';

  protected readonly stockOutIcon = ArrowUp;
  protected readonly movementsIcon = ClipboardList;
  protected readonly productIcon = Package;
  protected readonly infoIcon = Info;
  protected readonly checkIcon = CheckCircle2;
  protected readonly alertIcon = CircleAlert;
  protected readonly warningIcon = TriangleAlert;

  constructor(
    private readonly productService: ProductService,
    private readonly stockService: StockService,
    private readonly router: Router,
    private readonly toastService: ToastService
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

  protected get selectedProduct(): Product | null {
    return this.products.find((product) => product.id === Number(this.productId)) || null;
  }

  protected get resultingStock(): number | null {
    if (!this.selectedProduct || !this.quantity || this.quantity <= 0) {
      return null;
    }

    return this.selectedProduct.current_stock - this.quantity;
  }

  protected get exceedsAvailableStock(): boolean {
    return this.resultingStock !== null && this.resultingStock < 0;
  }

  protected handleSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.productId || !this.quantity || this.quantity <= 0) {
      this.errorMessage = 'Please select a product and enter a valid quantity.';
      return;
    }

    if (this.exceedsAvailableStock) {
      this.errorMessage = 'The quantity exceeds currently available stock.';
      return;
    }

    this.isSubmitting = true;

    this.stockService.createStockOut({
      product_id: Number(this.productId),
      quantity: this.quantity,
      reason: this.reason || null
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Stock out recorded successfully.';
        this.toastService.success('Stock out recorded', 'Outgoing stock was recorded successfully.');

        setTimeout(() => {
          this.router.navigate(['/app/stock/movements']);
        }, 700);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.detail || 'Unable to record stock out.';
        this.toastService.error('Stock out failed', this.errorMessage);
      }
    });
  }
}
