import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { BadgeComponent } from '../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-product-categories',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, PageHeaderComponent],
  templateUrl: './product-categories.html',
  styleUrl: './product-categories.scss'
})
export class ProductCategoriesComponent {
  protected searchTerm = '';

  protected readonly categories = [
    {
      name: 'Electronics',
      description: 'Electronic products and accessories',
      status: 'Active',
      tone: 'success' as const
    },
    {
      name: 'Accessories',
      description: 'Small accessories and add-on items',
      status: 'Active',
      tone: 'success' as const
    },
    {
      name: 'Office Supplies',
      description: 'Daily office and shop supplies',
      status: 'Inactive',
      tone: 'neutral' as const
    }
  ];

  protected get filteredCategories() {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(searchValue) ||
        category.description.toLowerCase().includes(searchValue) ||
        category.status.toLowerCase().includes(searchValue)
      );
    });
  }
}
