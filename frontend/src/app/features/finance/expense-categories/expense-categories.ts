import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { ExpenseCategory } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-expense-categories',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, LoadingStateComponent, PageHeaderComponent],
  templateUrl: './expense-categories.html',
  styleUrl: './expense-categories.scss'
})
export class ExpenseCategoriesComponent implements OnInit {
  protected searchTerm = '';
  protected categories: ExpenseCategory[] = [];
  protected isLoading = false;
  protected errorMessage = '';

  constructor(private readonly categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  protected loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getExpenseCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: () => {
        this.categories = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load expense categories.';
      }
    });
  }

  protected get filteredCategories(): ExpenseCategory[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.categories.filter((category) => {
      const status = category.is_active ? 'active' : 'inactive';

      return (
        category.name.toLowerCase().includes(searchValue) ||
        (category.description || '').toLowerCase().includes(searchValue) ||
        status.includes(searchValue)
      );
    });
  }

  protected getCategoryStatus(category: ExpenseCategory): string {
    return category.is_active ? 'Active' : 'Inactive';
  }

  protected getCategoryTone(category: ExpenseCategory): 'success' | 'neutral' {
    return category.is_active ? 'success' : 'neutral';
  }
}
