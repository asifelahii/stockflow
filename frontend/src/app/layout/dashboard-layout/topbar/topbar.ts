import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  LucideAngularModule,
  Moon,
  Package,
  Plus,
  Receipt,
  Sun,
  Truck
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

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class TopbarComponent implements OnInit {
  protected currentUser: UserResponse | null = null;
  protected isDarkMode = false;
  protected isQuickActionsOpen = false;

  protected readonly plusIcon = Plus;
  protected readonly moonIcon = Moon;
  protected readonly sunIcon = Sun;

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

  get userInitial(): string {
    return this.currentUser?.full_name?.charAt(0).toUpperCase() || 'U';
  }

  get workspaceName(): string {
    return this.workspaceContext.workspaceName('StockFlow Dashboard');
  }

  get themeToggleLabel(): string {
    return this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
  }

  toggleQuickActions(): void {
    this.isQuickActionsOpen = !this.isQuickActionsOpen;
  }

  closeQuickActions(): void {
    this.isQuickActionsOpen = false;
  }

  toggleTheme(): void {
    this.isDarkMode = this.themeService.toggleTheme() === 'dark';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target;

    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.closeQuickActions();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscapePress(): void {
    this.closeQuickActions();
  }
}
