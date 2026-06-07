import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { CategoryCreate, CategoryUpdate, ExpenseCategory } from '../../../core/models/category.model';
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
  protected isSubmitting = false;
  protected errorMessage = '';
  protected formError = '';

  protected isFormOpen = false;
  protected editingCategory: ExpenseCategory | null = null;
  protected categoryName = '';
  protected categoryDescription = '';
  protected categoryIsActive = true;

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

  protected openCreateForm(): void {
    this.isFormOpen = true;
    this.editingCategory = null;
    this.categoryName = '';
    this.categoryDescription = '';
    this.categoryIsActive = true;
    this.formError = '';
  }

  protected openEditForm(category: ExpenseCategory): void {
    this.isFormOpen = true;
    this.editingCategory = category;
    this.categoryName = category.name;
    this.categoryDescription = category.description || '';
    this.categoryIsActive = category.is_active;
    this.formError = '';
  }

  protected closeForm(): void {
    this.isFormOpen = false;
    this.editingCategory = null;
    this.categoryName = '';
    this.categoryDescription = '';
    this.categoryIsActive = true;
    this.formError = '';
  }

  protected handleSubmit(): void {
    this.formError = '';

    if (!this.categoryName.trim()) {
      this.formError = 'Category name is required.';
      return;
    }

    this.isSubmitting = true;

    if (this.editingCategory) {
      const payload: CategoryUpdate = {
        name: this.categoryName.trim(),
        description: this.categoryDescription.trim() || null,
        is_active: this.categoryIsActive
      };

      this.categoryService.updateExpenseCategory(this.editingCategory.id, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeForm();
          this.loadCategories();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update expense category.';
        }
      });

      return;
    }

    const payload: CategoryCreate = {
      name: this.categoryName.trim(),
      description: this.categoryDescription.trim() || null
    };

    this.categoryService.createExpenseCategory(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeForm();
        this.loadCategories();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create expense category.';
      }
    });
  }

  protected deactivateCategory(category: ExpenseCategory): void {
    const confirmed = confirm(`Deactivate expense category "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    this.categoryService.deleteExpenseCategory(category.id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to deactivate expense category.';
      }
    });
  }

  protected restoreCategory(category: ExpenseCategory): void {
    const confirmed = confirm(`Restore expense category "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    this.categoryService.updateExpenseCategory(category.id, { is_active: true }).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to restore expense category.';
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
