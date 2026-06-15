import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SidebarLink {
  label: string;
  route: string;
  icon: string;
}

interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapseToggled = new EventEmitter<void>();

  protected readonly sections: SidebarSection[] = [
    {
      title: 'Main',
      links: [
        { label: 'Dashboard', route: '/app/dashboard', icon: 'DB' }
      ]
    },
    {
      title: 'Inventory',
      links: [
        { label: 'Products', route: '/app/products', icon: 'PR' },
        { label: 'Product Categories', route: '/app/product-categories', icon: 'PC' },
        { label: 'Suppliers', route: '/app/suppliers', icon: 'SP' }
      ]
    },
    {
      title: 'Stock',
      links: [
        { label: 'Stock Movements', route: '/app/stock/movements', icon: 'SM' },
        { label: 'Stock In', route: '/app/stock/in', icon: 'SI' },
        { label: 'Stock Out', route: '/app/stock/out', icon: 'SO' },
        { label: 'Stock Adjustment', route: '/app/stock/adjustment', icon: 'SA' }
      ]
    },
    {
      title: 'Finance',
      links: [
        { label: 'Income', route: '/app/finance/income', icon: 'IN' },
        { label: 'Expenses', route: '/app/finance/expenses', icon: 'EX' },
        { label: 'Expense Categories', route: '/app/finance/expense-categories', icon: 'EC' }
      ]
    },
    {
      title: 'Reports',
      links: [
        { label: 'Reports', route: '/app/reports', icon: 'RP' }
      ]
    }
  ];

  protected toggleCollapse(): void {
    this.collapseToggled.emit();
  }
}
