import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertTriangle,
  CheckCircle2,
  Folder,
  LucideAngularModule,
  Pencil,
  Plus,
  Power,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Tag
} from 'lucide-angular';

import {
  CategoryCreate,
  CategoryUpdate,
  ProductCategory
} from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../core/services/toast.service';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { DrawerComponent } from '../../shared/components/drawer/drawer';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-product-categories',
  imports: [
    BadgeComponent,
    DrawerComponent,
    EmptyStateComponent,
    FormsModule,
    LoadingStateComponent,
    LucideAngularModule,
    PageHeaderComponent
  ],
  templateUrl: './product-categories.html',
  styleUrl: './product-categories.scss'
})
export class ProductCategoriesComponent implements OnInit {
  protected searchTerm = '';
  protected statusFilter = 'all';
  protected categories: ProductCategory[] = [];

  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';
  protected formError = '';

  protected isFormOpen = false;
  protected editingCategory: ProductCategory | null = null;

  protected categoryName = '';
  protected categoryDescription = '';
  protected categoryIsActive = true;

  protected readonly plusIcon = Plus;
  protected readonly searchIcon = Search;
  protected readonly filterIcon = SlidersHorizontal;
  protected readonly categoryIcon = Tag;
  protected readonly folderIcon = Folder;
  protected readonly editIcon = Pencil;
  protected readonly deactivateIcon = Power;
  protected readonly restoreIcon = RotateCcw;
  protected readonly alertIcon = AlertTriangle;
  protected readonly activeIcon = CheckCircle2;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly toastService: ToastService
  ) {}

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
    this.formError = '';
  }

  protected openEditForm(category: ProductCategory): void {
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

  protected clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
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

      this.categoryService.updateProductCategory(this.editingCategory.id, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toastService.success('Category updated', 'Product category was updated successfully.');
          this.closeForm();
          this.loadCategories();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update category.';
          this.toastService.error('Update failed', this.formError);
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
        this.toastService.success('Category created', 'New product category was added successfully.');
        this.closeForm();
        this.loadCategories();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create category.';
        this.toastService.error('Create failed', this.formError);
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
        this.toastService.success('Category deactivated', `${category.name} is now inactive.`);
        this.loadCategories();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to deactivate category.';
        this.toastService.error('Deactivate failed', this.errorMessage);
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
        this.toastService.success('Category restored', `${category.name} is active again.`);
        this.loadCategories();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to restore category.';
        this.toastService.error('Restore failed', this.errorMessage);
      }
    });
  }

  protected get filteredCategories(): ProductCategory[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchValue) ||
        (category.description || '').toLowerCase().includes(searchValue);

      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && category.is_active) ||
        (this.statusFilter === 'inactive' && !category.is_active);

      return matchesSearch && matchesStatus;
    });
  }

  protected get activeCategoryCount(): number {
    return this.categories.filter((category) => category.is_active).length;
  }

  protected get inactiveCategoryCount(): number {
    return this.categories.filter((category) => !category.is_active).length;
  }

  protected getCategoryStatus(category: ProductCategory): string {
    return category.is_active ? 'Active' : 'Inactive';
  }

  protected getCategoryTone(category: ProductCategory): 'success' | 'neutral' {
    return category.is_active ? 'success' : 'neutral';
  }

  protected getCategoryInitial(name: string): string {
    return name.trim().charAt(0).toUpperCase() || 'C';
  }
}
