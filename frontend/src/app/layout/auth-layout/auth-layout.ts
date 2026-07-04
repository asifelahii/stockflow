import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  ArrowUpRight,
  Boxes,
  ChartNoAxesCombined,
  CircleAlert,
  ClipboardList,
  LoaderCircle,
  LucideAngularModule,
  Package,
  TrendingUp,
  WalletCards
} from 'lucide-angular';

import { AuthService } from '../../core/services/auth.service';

type DemoTenantKey = 'tenant_1' | 'tenant_2';

@Component({
  selector: 'app-auth-layout',
  imports: [LucideAngularModule, RouterLink, RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayoutComponent {
  protected demoLoginLoading: DemoTenantKey | null = null;
  protected demoLoginError = '';

  protected readonly productsIcon = Boxes;
  protected readonly movementIcon = ClipboardList;
  protected readonly financeIcon = WalletCards;
  protected readonly packageIcon = Package;
  protected readonly trendIcon = TrendingUp;
  protected readonly chartIcon = ChartNoAxesCombined;
  protected readonly demoArrowIcon = ArrowUpRight;
  protected readonly demoLoadingIcon = LoaderCircle;
  protected readonly demoAlertIcon = CircleAlert;

  protected readonly demoTenants: Array<{
    key: DemoTenantKey;
    label: string;
    name: string;
    industry: string;
    accent: 'northstar' | 'greenleaf';
  }> = [
    {
      key: 'tenant_1',
      label: 'Tenant 01',
      name: 'Northstar Electronics',
      industry: 'Consumer electronics',
      accent: 'northstar'
    },
    {
      key: 'tenant_2',
      label: 'Tenant 02',
      name: 'Greenleaf Office Supplies',
      industry: 'Office and stationery',
      accent: 'greenleaf'
    }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  protected enterPublicDemo(tenantKey: DemoTenantKey): void {
    if (this.demoLoginLoading) {
      return;
    }

    this.demoLoginError = '';
    this.demoLoginLoading = tenantKey;

    this.authService.loginPublicDemo(tenantKey).subscribe({
      next: () => {
        this.demoLoginLoading = null;
        this.router.navigate(['/app/dashboard']);
      },
      error: (error) => {
        this.demoLoginLoading = null;
        this.demoLoginError =
          error?.error?.detail ||
          'The public workspace could not be opened. Please try again.';
      }
    });
  }
}
