import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-expenses',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, PageHeaderComponent],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss'
})
export class ExpensesComponent {
  protected searchTerm = '';

  protected readonly expenseRecords = [
    {
      category: 'Rent',
      description: 'Shop rent',
      amount: '৳ 8,000',
      paymentMethod: 'Cash',
      date: '2026-06-06',
      type: 'Expense',
      tone: 'danger' as const
    },
    {
      category: 'Supplier Payment',
      description: 'Payment to ABC Suppliers',
      amount: '৳ 12,500',
      paymentMethod: 'Bank Transfer',
      date: '2026-06-05',
      type: 'Expense',
      tone: 'danger' as const
    },
    {
      category: 'Utilities',
      description: 'Electricity bill',
      amount: '৳ 3,200',
      paymentMethod: 'bKash',
      date: '2026-06-04',
      type: 'Expense',
      tone: 'danger' as const
    }
  ];

  protected get filteredExpenseRecords() {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.expenseRecords.filter((record) => {
      return (
        record.category.toLowerCase().includes(searchValue) ||
        record.description.toLowerCase().includes(searchValue) ||
        record.paymentMethod.toLowerCase().includes(searchValue) ||
        record.date.toLowerCase().includes(searchValue)
      );
    });
  }
}
