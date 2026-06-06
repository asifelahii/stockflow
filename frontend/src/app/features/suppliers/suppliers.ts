import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { Supplier } from '../../core/models/supplier.model';
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
  protected errorMessage = '';

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

  protected get filteredSuppliers(): Supplier[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.suppliers.filter((supplier) => {
      const status = supplier.is_active ? 'active' : 'inactive';

      return (
        supplier.name.toLowerCase().includes(searchValue) ||
        (supplier.contact_person || '').toLowerCase().includes(searchValue) ||
        (supplier.phone || '').toLowerCase().includes(searchValue) ||
        (supplier.email || '').toLowerCase().includes(searchValue) ||
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
