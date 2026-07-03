import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertTriangle,
  Folder,
  LucideAngularModule,
  Pencil,
  Plus,
  Power,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Tags
} from 'lucide-angular';

import {
  CategoryCreate,
  CategoryUpdate,
  ExpenseCategory
} from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { DrawerComponent } from '../../../shared/components/drawer/drawer';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-expense-categories',
  imports: [
    BadgeComponent,
    DrawerComponent,
    EmptyStateComponent,
    FormsModule,
    LoadingStateComponent,
    LucideAngularModule,
    PageHeaderComponent
  ],
  templateUrl: './expense-categories.html',
  styleUrl: './expense-categories.scss'
})
export class ExpenseCategoriesComponent implements OnInit {
  protected searchTerm = '';
  protected statusFilter = 'all';
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

  protected readonly plusIcon = Plus;
  protected readonly searchIcon = Search;
  protected readonly filterIcon = SlidersHorizontal;
  protected readonly categoryIcon = Tags;
  protected readonly folderIcon = Folder;
  protected readonly editIcon = Pencil;
  protected readonly deactivateIcon = Power;
  protected readonly restoreIcon = RotateCcw;
  protected readonly alertIcon = AlertTriangle;

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

      this.categoryService.updateExpenseCategory(this.editingCategory.id, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toastService.success('Expense category updated', 'Expense category was updated successfully.');
          this.closeForm();
          this.loadCategories();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update expense category.';
          this.toastService.error('Update failed', this.formError);
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
        this.toastService.success(
          'Expense category created',
          'New expense category was added successfully.'
        );
        this.closeForm();
        this.loadCategories();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create expense category.';
        this.toastService.error('Create failed', this.formError);
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
        this.toastService.success('Expense category deactivated', `${category.name} is now inactive.`);
        this.loadCategories();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to deactivate expense category.';
        this.toastService.error('Deactivate failed', this.errorMessage);
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
        this.toastService.success('Expense category restored', `${category.name} is active again.`);
        this.loadCategories();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to restore expense category.';
        this.toastService.error('Restore failed', this.errorMessage);
      }
    });
  }

  protected get filteredCategories(): ExpenseCategory[] {
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

  protected getCategoryStatus(category: ExpenseCategory): string {
    return category.is_active ? 'Active' : 'Inactive';
  }

  protected getCategoryTone(category: ExpenseCategory): 'success' | 'neutral' {
    return category.is_active ? 'success' : 'neutral';
  }

  protected getCategoryInitial(name: string): string {
    return name.trim().charAt(0).toUpperCase() || 'E';
  }
}
