import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-expense-categories',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, PageHeaderComponent],
  templateUrl: './expense-categories.html',
  styleUrl: './expense-categories.scss'
})
export class ExpenseCategoriesComponent {
  protected searchTerm = '';

  protected readonly categories = [
    {
      name: 'Rent',
      description: 'Shop rent and office rent expenses',
      status: 'Active',
      tone: 'success' as const
    },
    {
      name: 'Utilities',
      description: 'Electricity, internet, water, and service bills',
      status: 'Active',
      tone: 'success' as const
    },
    {
      name: 'Supplier Payment',
      description: 'Payments made to suppliers and vendors',
      status: 'Active',
      tone: 'success' as const
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
