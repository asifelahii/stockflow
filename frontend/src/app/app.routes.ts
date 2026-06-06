import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ProductsComponent } from './features/products/products';
import { ProductCategoriesComponent } from './features/product-categories/product-categories';
import { SuppliersComponent } from './features/suppliers/suppliers';
import { StockMovementsComponent } from './features/stock/stock-movements/stock-movements';
import { StockInComponent } from './features/stock/stock-in/stock-in';
import { StockOutComponent } from './features/stock/stock-out/stock-out';
import { StockAdjustmentComponent } from './features/stock/stock-adjustment/stock-adjustment';
import { PlaceholderPageComponent } from './features/placeholder/placeholder-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },
  {
    path: 'app',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'products',
        component: ProductsComponent,
        data: {
          title: 'Products',
          description: 'Manage inventory products, stock levels, SKUs, and pricing.'
        }
      },
      {
        path: 'product-categories',
        component: ProductCategoriesComponent,
        data: {
          title: 'Product Categories',
          description: 'Organize products into clear business categories.'
        }
      },
      {
        path: 'suppliers',
        component: SuppliersComponent,
        data: {
          title: 'Suppliers',
          description: 'Manage supplier contacts and supplier-related product records.'
        }
      },
      {
        path: 'stock/movements',
        component: StockMovementsComponent,
        data: {
          title: 'Stock Movements',
          description: 'Track stock in, stock out, and adjustment history.'
        }
      },
      {
        path: 'stock/in',
        component: StockInComponent,
        data: {
          title: 'Stock In',
          description: 'Record incoming stock from purchase, return, or correction.'
        }
      },
      {
        path: 'stock/out',
        component: StockOutComponent,
        data: {
          title: 'Stock Out',
          description: 'Record outgoing stock from sales, damage, or usage.'
        }
      },
      {
        path: 'stock/adjustment',
        component: StockAdjustmentComponent,
        data: {
          title: 'Stock Adjustment',
          description: 'Correct product stock after physical verification.'
        }
      },
      {
        path: 'finance/income',
        component: PlaceholderPageComponent,
        data: {
          title: 'Income',
          description: 'Track business income and sales-related records.'
        }
      },
      {
        path: 'finance/expenses',
        component: PlaceholderPageComponent,
        data: {
          title: 'Expenses',
          description: 'Track operational costs and business expenses.'
        }
      },
      {
        path: 'finance/expense-categories',
        component: PlaceholderPageComponent,
        data: {
          title: 'Expense Categories',
          description: 'Organize expenses into meaningful categories.'
        }
      },
      {
        path: 'reports',
        component: PlaceholderPageComponent,
        data: {
          title: 'Reports',
          description: 'View summaries and export business records.'
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];







