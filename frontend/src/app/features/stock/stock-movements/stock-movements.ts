import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-stock-movements',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, PageHeaderComponent],
  templateUrl: './stock-movements.html',
  styleUrl: './stock-movements.scss'
})
export class StockMovementsComponent {
  protected searchTerm = '';
  protected typeFilter = 'all';

  protected readonly movements = [
    {
      product: 'Wireless Mouse',
      sku: 'MOUSE-001',
      type: 'Stock In',
      quantity: '+20',
      previousStock: 30,
      newStock: 50,
      reason: 'Purchase received',
      date: '2026-06-06',
      tone: 'success' as const
    },
    {
      product: 'USB Keyboard',
      sku: 'KEY-002',
      type: 'Stock Out',
      quantity: '-5',
      previousStock: 9,
      newStock: 4,
      reason: 'Customer sale',
      date: '2026-06-05',
      tone: 'danger' as const
    },
    {
      product: 'HDMI Cable',
      sku: 'HDMI-010',
      type: 'Adjustment',
      quantity: '7',
      previousStock: 10,
      newStock: 7,
      reason: 'Physical count correction',
      date: '2026-06-04',
      tone: 'info' as const
    }
  ];

  protected get filteredMovements() {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.movements.filter((movement) => {
      const matchesSearch =
        movement.product.toLowerCase().includes(searchValue) ||
        movement.sku.toLowerCase().includes(searchValue) ||
        movement.reason.toLowerCase().includes(searchValue) ||
        movement.type.toLowerCase().includes(searchValue);

      const matchesType =
        this.typeFilter === 'all' ||
        movement.type.toLowerCase().replace(' ', '-') === this.typeFilter;

      return matchesSearch && matchesType;
    });
  }
}
