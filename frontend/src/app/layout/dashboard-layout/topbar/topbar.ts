import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  DollarSign,
  LayoutDashboard,
  LucideAngularModule,
  Moon,
  Package,
  Plus,
  Receipt,
  Search,
  Sun,
  Truck,
  X
} from 'lucide-angular';

import { UserResponse } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { WorkspaceContextService } from '../../../core/workspace/workspace-context.service';

interface QuickAction {
  label: string;
  description: string;
  route: string;
  icon: any;
}

interface HeaderSearchItem {
  label: string;
  description: string;
  route: string;
  keywords: string;
  icon: any;
}

@Component({
  selector: 'app-topbar',
  imports: [FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class TopbarComponent implements OnInit {
  protected currentUser: UserResponse | null = null;
  protected isDarkMode = false;
  protected isQuickActionsOpen = false;
  protected isSearchOpen = false;
  protected globalSearchTerm = '';

  protected readonly plusIcon = Plus;
  protected readonly moonIcon = Moon;
  protected readonly sunIcon = Sun;
  protected readonly searchIcon = Search;
  protected readonly clearIcon = X;

  protected readonly quickActions: QuickAction[] = [
    {
      label: 'Add Product',
      description: 'Create or manage inventory items',
      route: '/app/products',
      icon: Package
    },
    {
      label: 'Stock In',
      description: 'Record incoming stock',
      route: '/app/stock/in',
      icon: ArrowDown
    },
    {
      label: 'Stock Out',
      description: 'Record outgoing stock',
      route: '/app/stock/out',
      icon: ArrowUp
    },
    {
      label: 'Add Income',
      description: 'Track new business income',
      route: '/app/finance/income',
      icon: DollarSign
    },
    {
      label: 'Add Expense',
      description: 'Record business expenses',
      route: '/app/finance/expenses',
      icon: Receipt
    },
    {
      label: 'Add Supplier',
      description: 'Manage supplier records',
      route: '/app/suppliers',
      icon: Truck
    }
  ];

  protected readonly headerSearchItems: HeaderSearchItem[] = [
    {
      label: 'Dashboard',
      description: 'Workspace overview and analytics',
      route: '/app/dashboard',
      keywords: 'dashboard overview analytics home',
      icon: LayoutDashboard
    },
    {
      label: 'Products',
      description: 'Inventory catalogue and stock levels',
      route: '/app/products',
      keywords: 'products inventory items sku stock',
      icon: Package
    },
    {
      label: 'Suppliers',
      description: 'Supplier contacts and records',
      route: '/app/suppliers',
      keywords: 'suppliers vendors contacts',
      icon: Truck
    },
    {
      label: 'Stock Movements',
      description: 'Stock in, stock out, and adjustments',
      route: '/app/stock/movements',
      keywords: 'stock movements stock in stock out adjustment',
      icon: ArrowDown
    },
    {
      label: 'Income',
      description: 'Business income records',
      route: '/app/finance/income',
      keywords: 'income finance revenue money',
      icon: DollarSign
    },
    {
      label: 'Expenses',
      description: 'Business expense records',
      route: '/app/finance/expenses',
      keywords: 'expenses spending finance costs',
      icon: Receipt
    },
    {
      label: 'Reports',
      description: 'Exports and business summaries',
      route: '/app/reports',
      keywords: 'reports export csv excel pdf analytics',
      icon: BarChart3
    }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly themeService: ThemeService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: () => {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  protected get userInitial(): string {
    return this.currentUser?.full_name?.charAt(0).toUpperCase() || 'U';
  }

  protected get workspaceName(): string {
    return this.workspaceContext.workspaceName('StockFlow Dashboard');
  }

  protected get themeToggleLabel(): string {
    return this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
  }

  protected get filteredSearchItems(): HeaderSearchItem[] {
    const term = this.globalSearchTerm.trim().toLowerCase();

    if (!term) {
      return this.headerSearchItems.slice(0, 6);
    }

    return this.headerSearchItems
      .filter((item) =>
        `${item.label} ${item.description} ${item.keywords}`
          .toLowerCase()
          .includes(term)
      )
      .slice(0, 6);
  }

  protected toggleQuickActions(): void {
    this.isQuickActionsOpen = !this.isQuickActionsOpen;
    this.isSearchOpen = false;
  }

  protected closeQuickActions(): void {
    this.isQuickActionsOpen = false;
  }

  protected openSearch(): void {
    this.isSearchOpen = true;
    this.closeQuickActions();
  }

  protected closeSearch(): void {
    this.isSearchOpen = false;
  }

  protected clearSearch(): void {
    this.globalSearchTerm = '';
    this.isSearchOpen = true;
  }

  protected openSearchItem(item: HeaderSearchItem): void {
    this.router.navigate([item.route]);
    this.globalSearchTerm = '';
    this.closeSearch();
  }

  protected openFirstSearchItem(): void {
    const firstItem = this.filteredSearchItems[0];

    if (firstItem) {
      this.openSearchItem(firstItem);
    }
  }

  protected toggleTheme(): void {
    this.isDarkMode = this.themeService.toggleTheme() === 'dark';
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target;

    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.closeQuickActions();
      this.closeSearch();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscapePress(): void {
    this.closeQuickActions();
    this.closeSearch();
  }
}
