import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { BadgeComponent } from '../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-suppliers',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, PageHeaderComponent],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.scss'
})
export class SuppliersComponent {
  protected searchTerm = '';

  protected readonly suppliers = [
    {
      name: 'ABC Suppliers',
      contactPerson: 'Mr. Rahim',
      phone: '01700000000',
      email: 'abc@example.com',
      status: 'Active',
      tone: 'success' as const
    },
    {
      name: 'Tech Source',
      contactPerson: 'Ms. Karim',
      phone: '01800000000',
      email: 'techsource@example.com',
      status: 'Active',
      tone: 'success' as const
    },
    {
      name: 'Cable House',
      contactPerson: 'Mr. Hasan',
      phone: '01900000000',
      email: 'cable@example.com',
      status: 'Inactive',
      tone: 'neutral' as const
    }
  ];

  protected get filteredSuppliers() {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.suppliers.filter((supplier) => {
      return (
        supplier.name.toLowerCase().includes(searchValue) ||
        supplier.contactPerson.toLowerCase().includes(searchValue) ||
        supplier.phone.toLowerCase().includes(searchValue) ||
        supplier.email.toLowerCase().includes(searchValue) ||
        supplier.status.toLowerCase().includes(searchValue)
      );
    });
  }
}
