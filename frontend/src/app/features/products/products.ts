import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { BadgeComponent } from '../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-products',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, PageHeaderComponent],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsComponent {
  protected searchTerm = '';
  protected statusFilter = 'all';

  protected readonly products = [
    {
      name: 'Wireless Mouse',
      sku: 'MOUSE-001',
      category: 'Electronics',
      supplier: 'ABC Suppliers',
      stock: 50,
      sellingPrice: '৳ 650',
      status: 'Active',
      tone: 'success' as const
    },
    {
      name: 'USB Keyboard',
      sku: 'KEY-002',
      category: 'Electronics',
      supplier: 'Tech Source',
      stock: 4,
      sellingPrice: '৳ 900',
      status: 'Low Stock',
      tone: 'warning' as const
    },
    {
      name: 'HDMI Cable',
      sku: 'HDMI-010',
      category: 'Accessories',
      supplier: 'Cable House',
      stock: 7,
      sellingPrice: '৳ 350',
      status: 'Low Stock',
      tone: 'warning' as const
    }
  ];

  protected get filteredProducts() {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        product.sku.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        product.supplier.toLowerCase().includes(searchValue);

      const matchesStatus =
        this.statusFilter === 'all' ||
        product.status.toLowerCase().replace(' ', '-') === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }
}
