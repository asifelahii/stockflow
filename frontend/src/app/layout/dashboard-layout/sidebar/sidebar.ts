import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SidebarLink {
  label: string;
  route: string;
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
  protected readonly sections: SidebarSection[] = [
    {
      title: 'Main',
      links: [
        { label: 'Dashboard', route: '/app/dashboard' }
      ]
    },
    {
      title: 'Inventory',
      links: [
        { label: 'Products', route: '/app/products' },
        { label: 'Product Categories', route: '/app/product-categories' },
        { label: 'Suppliers', route: '/app/suppliers' }
      ]
    },
    {
      title: 'Stock',
      links: [
        { label: 'Stock Movements', route: '/app/stock/movements' },
        { label: 'Stock In', route: '/app/stock/in' },
        { label: 'Stock Out', route: '/app/stock/out' },
        { label: 'Stock Adjustment', route: '/app/stock/adjustment' }
      ]
    },
    {
      title: 'Finance',
      links: [
        { label: 'Income', route: '/app/finance/income' },
        { label: 'Expenses', route: '/app/finance/expenses' },
        { label: 'Expense Categories', route: '/app/finance/expense-categories' }
      ]
    },
    {
      title: 'Reports',
      links: [
        { label: 'Reports', route: '/app/reports' }
      ]
    }
  ];
}
