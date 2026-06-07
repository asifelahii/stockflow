import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { StockMovement } from '../../../core/models/stock.model';
import { StockService } from '../../../core/services/stock.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-stock-movements',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, LoadingStateComponent, PageHeaderComponent],
  templateUrl: './stock-movements.html',
  styleUrl: './stock-movements.scss'
})
export class StockMovementsComponent implements OnInit {
  protected searchTerm = '';
  protected typeFilter = 'all';
  protected movements: StockMovement[] = [];
  protected isLoading = false;
  protected errorMessage = '';

  constructor(private readonly stockService: StockService) {}

  ngOnInit(): void {
    this.loadMovements();
  }

  protected loadMovements(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.stockService.getStockMovements().subscribe({
      next: (movements) => {
        this.movements = movements;
        this.isLoading = false;
      },
      error: () => {
        this.movements = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load stock movements.';
      }
    });
  }

  protected get filteredMovements(): StockMovement[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.movements.filter((movement) => {
      const formattedType = this.formatMovementType(movement.movement_type).toLowerCase();

      const matchesSearch =
        String(movement.product_id).includes(searchValue) ||
        formattedType.includes(searchValue) ||
        String(movement.quantity).includes(searchValue) ||
        String(movement.previous_stock).includes(searchValue) ||
        String(movement.new_stock).includes(searchValue) ||
        (movement.reason || '').toLowerCase().includes(searchValue);

      const matchesType =
        this.typeFilter === 'all' || movement.movement_type === this.typeFilter;

      return matchesSearch && matchesType;
    });
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
}
