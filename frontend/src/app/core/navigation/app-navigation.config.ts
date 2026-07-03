import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  FileText,
  Folder,
  Home,
  Package,
  Receipt,
  RefreshCw,
  Settings,
  Tag,
  Truck
} from 'lucide-angular';

export interface AppNavigationLink {
  label: string;
  route: string;
  icon: any;
}

export interface AppNavigationSection {
  title: string;
  links: readonly AppNavigationLink[];
}

export const APP_NAVIGATION: readonly AppNavigationSection[] = [
  {
    title: 'Workspace',
    links: [{ label: 'Dashboard', route: '/app/dashboard', icon: Home }]
  },
  {
    title: 'Inventory',
    links: [
      { label: 'Products', route: '/app/products', icon: Package },
      { label: 'Categories', route: '/app/product-categories', icon: Tag },
      { label: 'Suppliers', route: '/app/suppliers', icon: Truck }
    ]
  },
  {
    title: 'Stock Control',
    links: [
      { label: 'Movements', route: '/app/stock/movements', icon: RefreshCw },
      { label: 'Stock In', route: '/app/stock/in', icon: ArrowDown },
      { label: 'Stock Out', route: '/app/stock/out', icon: ArrowUp },
      { label: 'Adjustment', route: '/app/stock/adjustment', icon: Settings }
    ]
  },
  {
    title: 'Finance',
    links: [
      { label: 'Income', route: '/app/finance/income', icon: DollarSign },
      { label: 'Expenses', route: '/app/finance/expenses', icon: Receipt },
      {
        label: 'Expense Categories',
        route: '/app/finance/expense-categories',
        icon: Folder
      }
    ]
  },
  {
    title: 'Insights',
    links: [{ label: 'Reports', route: '/app/reports', icon: FileText }]
  }
];
