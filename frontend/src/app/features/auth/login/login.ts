import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  LockKeyhole,
  LucideAngularModule,
  Mail,
  ShieldCheck
} from 'lucide-angular';

import { OAuthProvider, OAuthProvidersResponse } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
  protected email = '';
  protected password = '';
  protected isPasswordVisible = false;
  protected isLoading = false;
  protected errorMessage = '';

  protected socialProvidersLoaded = false;
  protected socialLoadingProvider: OAuthProvider | null = null;
  protected socialProviders: OAuthProvidersResponse = {
    google: false,
    facebook: false,
    apple: false
  };

  protected readonly emailIcon = Mail;
  protected readonly passwordIcon = LockKeyhole;
  protected readonly visibleIcon = Eye;
  protected readonly hiddenIcon = EyeOff;
  protected readonly alertIcon = CircleAlert;
  protected readonly submitIcon = ArrowRight;
  protected readonly secureIcon = ShieldCheck;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getOAuthProviders().subscribe({
      next: (providers) => {
        this.socialProviders = providers;
        this.socialProvidersLoaded = true;
      },
      error: () => {
        this.socialProvidersLoaded = true;
      }
    });
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  protected handleLogin(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/app/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error?.error?.detail || 'Login failed. Please check your credentials.';
      }
    });
  }

  protected handleSocialLogin(provider: OAuthProvider): void {
    this.errorMessage = '';

    if (!this.socialProvidersLoaded) {
      this.errorMessage = 'Checking social sign-in availability. Please try again.';
      return;
    }

    if (!this.socialProviders[provider]) {
      this.errorMessage = `${this.providerLabel(provider)} sign-in is not configured yet.`;
      return;
    }

    this.socialLoadingProvider = provider;
    this.authService.startOAuthLogin(provider);
  }

  protected isSocialDisabled(provider: OAuthProvider): boolean {
    return (
      this.isLoading ||
      this.socialLoadingProvider !== null ||
      !this.socialProvidersLoaded ||
      !this.socialProviders[provider]
    );
  }

  protected providerLabel(provider: OAuthProvider): string {
    if (provider === 'facebook') {
      return 'Facebook';
    }

    if (provider === 'apple') {
      return 'Apple';
    }

    return 'Google';
  }
}
