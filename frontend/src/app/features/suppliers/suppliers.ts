import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  LucideAngularModule,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Power,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Truck
} from 'lucide-angular';

import { Supplier, SupplierCreate, SupplierUpdate } from '../../core/models/supplier.model';
import { SupplierService } from '../../core/services/supplier.service';
import { ToastService } from '../../core/services/toast.service';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { DrawerComponent } from '../../shared/components/drawer/drawer';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-suppliers',
  imports: [
    BadgeComponent,
    DrawerComponent,
    EmptyStateComponent,
    FormsModule,
    LoadingStateComponent,
    LucideAngularModule,
    PageHeaderComponent
  ],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.scss'
})
export class SuppliersComponent implements OnInit {
  protected searchTerm = '';
  protected statusFilter = 'all';
  protected suppliers: Supplier[] = [];

  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';
  protected formError = '';

  protected isFormOpen = false;
  protected editingSupplier: Supplier | null = null;

  protected supplierName = '';
  protected contactPerson = '';
  protected phone = '';
  protected email = '';
  protected address = '';
  protected supplierIsActive = true;

  protected readonly plusIcon = Plus;
  protected readonly searchIcon = Search;
  protected readonly filterIcon = SlidersHorizontal;
  protected readonly supplierIcon = Truck;
  protected readonly businessIcon = Building2;
  protected readonly phoneIcon = Phone;
  protected readonly mailIcon = Mail;
  protected readonly locationIcon = MapPin;
  protected readonly editIcon = Pencil;
  protected readonly deactivateIcon = Power;
  protected readonly restoreIcon = RotateCcw;
  protected readonly alertIcon = AlertTriangle;
  protected readonly activeIcon = CheckCircle2;

  constructor(
    private readonly supplierService: SupplierService,
    private readonly toastService: ToastService
  ) {}

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
    this.formError = '';
  }

  protected clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
  }

  protected handleSubmit(): void {
    this.formError = '';

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
          this.toastService.success('Supplier updated', 'Supplier details were updated successfully.');
          this.closeForm();
          this.loadSuppliers();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update supplier.';
          this.toastService.error('Update failed', this.formError);
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
        this.toastService.success('Supplier created', 'New supplier was added successfully.');
        this.closeForm();
        this.loadSuppliers();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create supplier.';
        this.toastService.error('Create failed', this.formError);
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
        this.toastService.success('Supplier deactivated', `${supplier.name} is now inactive.`);
        this.loadSuppliers();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to deactivate supplier.';
        this.toastService.error('Deactivate failed', this.errorMessage);
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
        this.toastService.success('Supplier restored', `${supplier.name} is active again.`);
        this.loadSuppliers();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to restore supplier.';
        this.toastService.error('Restore failed', this.errorMessage);
      }
    });
  }

  protected get filteredSuppliers(): Supplier[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchValue) ||
        (supplier.contact_person || '').toLowerCase().includes(searchValue) ||
        (supplier.phone || '').toLowerCase().includes(searchValue) ||
        (supplier.email || '').toLowerCase().includes(searchValue) ||
        (supplier.address || '').toLowerCase().includes(searchValue);

      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && supplier.is_active) ||
        (this.statusFilter === 'inactive' && !supplier.is_active);

      return matchesSearch && matchesStatus;
    });
  }

  protected get activeSupplierCount(): number {
    return this.suppliers.filter((supplier) => supplier.is_active).length;
  }

  protected get inactiveSupplierCount(): number {
    return this.suppliers.filter((supplier) => !supplier.is_active).length;
  }

  protected getSupplierStatus(supplier: Supplier): string {
    return supplier.is_active ? 'Active' : 'Inactive';
  }

  protected getSupplierTone(supplier: Supplier): 'success' | 'neutral' {
    return supplier.is_active ? 'success' : 'neutral';
  }

  protected getSupplierInitial(name: string): string {
    return name.trim().charAt(0).toUpperCase() || 'S';
  }
}
