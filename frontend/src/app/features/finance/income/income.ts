import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-income',
  imports: [BadgeComponent, EmptyStateComponent, FormsModule, PageHeaderComponent],
  templateUrl: './income.html',
  styleUrl: './income.scss'
})
export class IncomeComponent {
  protected searchTerm = '';

  protected readonly incomeRecords = [
    {
      description: 'Daily sales income',
      amount: '৳ 15,000',
      paymentMethod: 'Cash',
      date: '2026-06-06',
      type: 'Income',
      tone: 'success' as const
    },
    {
      description: 'Online order payment',
      amount: '৳ 8,500',
      paymentMethod: 'bKash',
      date: '2026-06-05',
      type: 'Income',
      tone: 'success' as const
    },
    {
      description: 'Wholesale customer payment',
      amount: '৳ 24,000',
      paymentMethod: 'Bank Transfer',
      date: '2026-06-04',
      type: 'Income',
      tone: 'success' as const
    }
  ];

  protected get filteredIncomeRecords() {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.incomeRecords.filter((record) => {
      return (
        record.description.toLowerCase().includes(searchValue) ||
        record.paymentMethod.toLowerCase().includes(searchValue) ||
        record.date.toLowerCase().includes(searchValue)
      );
    });
  }
}
