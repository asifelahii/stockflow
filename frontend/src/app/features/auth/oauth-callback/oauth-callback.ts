import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CircleAlert,
  CircleCheck,
  LucideAngularModule,
  RefreshCw
} from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-oauth-callback',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './oauth-callback.html',
  styleUrl: './oauth-callback.scss'
})
export class OAuthCallbackComponent implements OnInit {
  protected isLoading = true;
  protected errorMessage = '';

  protected readonly loadingIcon = RefreshCw;
  protected readonly successIcon = CircleCheck;
  protected readonly alertIcon = CircleAlert;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const error = params.get('error');
    const ticket = params.get('ticket');

    if (error || !ticket) {
      this.showError('Social sign-in could not be completed. Please try again.');
      return;
    }

    this.authService.exchangeOAuthTicket(ticket).subscribe({
      next: () => {
        this.router.navigate(['/app/dashboard'], { replaceUrl: true });
      },
      error: (response) => {
        this.showError(
          response?.error?.detail ||
          'The social sign-in ticket expired. Please try again.'
        );
      }
    });
  }

  private showError(message: string): void {
    this.isLoading = false;
    this.errorMessage = message;
  }
}
