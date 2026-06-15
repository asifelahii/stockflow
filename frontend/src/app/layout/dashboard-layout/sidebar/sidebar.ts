import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  Folder,
  Home,
  LucideAngularModule,
  Package,
  Receipt,
  RefreshCw,
  Settings,
  Tag,
  Truck
} from 'lucide-angular';

interface SidebarLink {
  label: string;
  route: string;
  icon: any;
}

interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapseToggled = new EventEmitter<void>();

  protected readonly collapseIcon = ChevronLeft;
  protected readonly expandIcon = ChevronRight;

  protected readonly sections: SidebarSection[] = [
    {
      title: 'Main',
      links: [
        { label: 'Dashboard', route: '/app/dashboard', icon: Home }
      ]
    },
    {
      title: 'Inventory',
      links: [
        { label: 'Products', route: '/app/products', icon: Package },
        { label: 'Product Categories', route: '/app/product-categories', icon: Tag },
        { label: 'Suppliers', route: '/app/suppliers', icon: Truck }
      ]
    },
    {
      title: 'Stock',
      links: [
        { label: 'Stock Movements', route: '/app/stock/movements', icon: RefreshCw },
        { label: 'Stock In', route: '/app/stock/in', icon: ArrowDown },
        { label: 'Stock Out', route: '/app/stock/out', icon: ArrowUp },
        { label: 'Stock Adjustment', route: '/app/stock/adjustment', icon: Settings }
      ]
    },
    {
      title: 'Finance',
      links: [
        { label: 'Income', route: '/app/finance/income', icon: DollarSign },
        { label: 'Expenses', route: '/app/finance/expenses', icon: Receipt },
        { label: 'Expense Categories', route: '/app/finance/expense-categories', icon: Folder }
      ]
    },
    {
      title: 'Reports',
      links: [
        { label: 'Reports', route: '/app/reports', icon: FileText }
      ]
    }
  ];

  protected toggleCollapse(): void {
    this.collapseToggled.emit();
  }
}
