import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { Supplier, SupplierCreate, SupplierUpdate } from '../../core/models/supplier.model';
import { SupplierService } from '../../core/services/supplier.service';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-suppliers',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, LoadingStateComponent, PageHeaderComponent],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.scss'
})
export class SuppliersComponent implements OnInit {
  protected searchTerm = '';
  protected suppliers: Supplier[] = [];
  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';
  protected formMessage = '';
  protected formError = '';

  protected isFormOpen = false;
  protected editingSupplier: Supplier | null = null;
  protected supplierName = '';
  protected contactPerson = '';
  protected phone = '';
  protected email = '';
  protected address = '';
  protected supplierIsActive = true;

  constructor(private readonly supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  protected loadSuppliers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.isLoading = false;
      },
      error: () => {
        this.suppliers = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load suppliers.';
      }
    });
  }

  protected openCreateForm(): void {
    this.isFormOpen = true;
    this.editingSupplier = null;
    this.supplierName = '';
    this.contactPerson = '';
    this.phone = '';
    this.email = '';
    this.address = '';
    this.supplierIsActive = true;
    this.formMessage = '';
    this.formError = '';
  }

  protected openEditForm(supplier: Supplier): void {
    this.isFormOpen = true;
    this.editingSupplier = supplier;
    this.supplierName = supplier.name;
    this.contactPerson = supplier.contact_person || '';
    this.phone = supplier.phone || '';
    this.email = supplier.email || '';
    this.address = supplier.address || '';
    this.supplierIsActive = supplier.is_active;
    this.formMessage = '';
    this.formError = '';
  }

  protected closeForm(): void {
    this.isFormOpen = false;
    this.editingSupplier = null;
    this.supplierName = '';
    this.contactPerson = '';
    this.phone = '';
    this.email = '';
    this.address = '';
    this.supplierIsActive = true;
    this.formMessage = '';
    this.formError = '';
  }

  protected handleSubmit(): void {
    this.formError = '';
    this.formMessage = '';

    if (!this.supplierName.trim()) {
      this.formError = 'Supplier name is required.';
      return;
    }

    this.isSubmitting = true;

    if (this.editingSupplier) {
      const payload: SupplierUpdate = {
        name: this.supplierName.trim(),
        contact_person: this.contactPerson.trim() || null,
        phone: this.phone.trim() || null,
        email: this.email.trim() || null,
        address: this.address.trim() || null,
        is_active: this.supplierIsActive
      };

      this.supplierService.updateSupplier(this.editingSupplier.id, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeForm();
          this.loadSuppliers();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update supplier.';
        }
      });

      return;
    }

    const payload: SupplierCreate = {
      name: this.supplierName.trim(),
      contact_person: this.contactPerson.trim() || null,
      phone: this.phone.trim() || null,
      email: this.email.trim() || null,
      address: this.address.trim() || null
    };

    this.supplierService.createSupplier(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeForm();
        this.loadSuppliers();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create supplier.';
      }
    });
  }

  protected deactivateSupplier(supplier: Supplier): void {
    const confirmed = confirm(`Deactivate supplier "${supplier.name}"?`);

    if (!confirmed) {
      return;
    }

    this.supplierService.deleteSupplier(supplier.id).subscribe({
      next: () => {
        this.loadSuppliers();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to deactivate supplier.';
      }
    });
  }

  protected restoreSupplier(supplier: Supplier): void {
    const confirmed = confirm(`Restore supplier "${supplier.name}"?`);

    if (!confirmed) {
      return;
    }

    this.supplierService.updateSupplier(supplier.id, { is_active: true }).subscribe({
      next: () => {
        this.loadSuppliers();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to restore supplier.';
      }
    });
  }

  protected get filteredSuppliers(): Supplier[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.suppliers.filter((supplier) => {
      const status = supplier.is_active ? 'active' : 'inactive';

      return (
        supplier.name.toLowerCase().includes(searchValue) ||
        (supplier.contact_person || '').toLowerCase().includes(searchValue) ||
        (supplier.phone || '').toLowerCase().includes(searchValue) ||
        (supplier.email || '').toLowerCase().includes(searchValue) ||
        (supplier.address || '').toLowerCase().includes(searchValue) ||
        status.includes(searchValue)
      );
    });
  }

  protected getSupplierStatus(supplier: Supplier): string {
    return supplier.is_active ? 'Active' : 'Inactive';
  }

  protected getSupplierTone(supplier: Supplier): 'success' | 'neutral' {
    return supplier.is_active ? 'success' : 'neutral';
  }
}
