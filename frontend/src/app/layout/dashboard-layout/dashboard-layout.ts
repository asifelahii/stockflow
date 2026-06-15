import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { SidebarComponent } from './sidebar/sidebar';
import { TopbarComponent } from './topbar/topbar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayoutComponent {
  private readonly sidebarStorageKey = 'stockflow_sidebar_collapsed';

  protected isSidebarOpen = false;
  protected isSidebarCollapsed = false;

  constructor(private readonly router: Router) {
    this.isSidebarCollapsed = localStorage.getItem(this.sidebarStorageKey) === 'true';

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeSidebar();
      });
  }

  protected toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  protected closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  protected toggleSidebarCollapsed(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem(this.sidebarStorageKey, String(this.isSidebarCollapsed));
  }
}
