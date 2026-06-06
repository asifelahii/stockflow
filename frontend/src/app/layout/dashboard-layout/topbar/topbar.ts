import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserResponse } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class TopbarComponent implements OnInit {
  protected currentUser: UserResponse | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
