import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { CategoryCreate, CategoryUpdate, ProductCategory } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-product-categories',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, LoadingStateComponent, PageHeaderComponent],
  templateUrl: './product-categories.html',
  styleUrl: './product-categories.scss'
})
export class ProductCategoriesComponent implements OnInit {
  protected searchTerm = '';
  protected categories: ProductCategory[] = [];
  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';
  protected formMessage = '';
  protected formError = '';

  protected isFormOpen = false;
  protected editingCategory: ProductCategory | null = null;
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

    this.categoryService.getProductCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: () => {
        this.categories = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load product categories.';
      }
    });
  }

  protected openCreateForm(): void {
    this.isFormOpen = true;
    this.editingCategory = null;
    this.categoryName = '';
    this.categoryDescription = '';
    this.categoryIsActive = true;
    this.formMessage = '';
    this.formError = '';
  }

  protected openEditForm(category: ProductCategory): void {
    this.isFormOpen = true;
    this.editingCategory = category;
    this.categoryName = category.name;
    this.categoryDescription = category.description || '';
    this.categoryIsActive = category.is_active;
    this.formMessage = '';
    this.formError = '';
  }

  protected closeForm(): void {
    this.isFormOpen = false;
    this.editingCategory = null;
    this.categoryName = '';
    this.categoryDescription = '';
    this.categoryIsActive = true;
    this.formMessage = '';
    this.formError = '';
  }

  protected handleSubmit(): void {
    this.formError = '';
    this.formMessage = '';

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

      this.categoryService.updateProductCategory(this.editingCategory.id, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.formMessage = 'Category updated successfully.';
          this.closeForm();
          this.loadCategories();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update category.';
        }
      });

      return;
    }

    const payload: CategoryCreate = {
      name: this.categoryName.trim(),
      description: this.categoryDescription.trim() || null
    };

    this.categoryService.createProductCategory(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.formMessage = 'Category created successfully.';
        this.closeForm();
        this.loadCategories();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create category.';
      }
    });
  }

  protected deactivateCategory(category: ProductCategory): void {
    const confirmed = confirm(`Deactivate product category "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    this.categoryService.deleteProductCategory(category.id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to deactivate category.';
      }
    });
  }

  protected restoreCategory(category: ProductCategory): void {
    const confirmed = confirm(`Restore product category "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    this.categoryService.updateProductCategory(category.id, { is_active: true }).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to restore category.';
      }
    });
  }

  protected get filteredCategories(): ProductCategory[] {
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

  protected getCategoryStatus(category: ProductCategory): string {
    return category.is_active ? 'Active' : 'Inactive';
  }

  protected getCategoryTone(category: ProductCategory): 'success' | 'neutral' {
    return category.is_active ? 'success' : 'neutral';
  }
}

