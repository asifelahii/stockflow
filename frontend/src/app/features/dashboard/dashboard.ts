import { Component } from '@angular/core';

import { BadgeComponent } from '../../shared/components/badge/badge';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card';

@Component({
  selector: 'app-dashboard',
  imports: [BadgeComponent, PageHeaderComponent, StatCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  protected readonly stockMovements = [
    {
      product: 'Wireless Mouse',
      type: 'Stock In',
      quantity: '+20',
      time: 'Today, 10:30 AM',
      tone: 'success' as const
    },
    {
      product: 'USB Keyboard',
      type: 'Stock Out',
      quantity: '-5',
      time: 'Today, 09:15 AM',
      tone: 'danger' as const
    },
    {
      product: 'HDMI Cable',
      type: 'Adjustment',
      quantity: '42',
      time: 'Yesterday',
      tone: 'info' as const
    }
  ];

  protected readonly financeActivities = [
    {
      title: 'Daily sales income',
      type: 'Income',
      amount: '৳ 15,000',
      tone: 'success' as const
    },
    {
      title: 'Shop rent',
      type: 'Expense',
      amount: '৳ 8,000',
      tone: 'danger' as const
    },
    {
      title: 'Supplier payment',
      type: 'Expense',
      amount: '৳ 12,500',
      tone: 'danger' as const
    }
  ];

  protected readonly lowStockProducts = [
    {
      name: 'USB Keyboard',
      stock: 4,
      threshold: 10
    },
    {
      name: 'HDMI Cable',
      stock: 7,
      threshold: 15
    },
    {
      name: 'Laptop Stand',
      stock: 3,
      threshold: 8
    }
  ];
}
