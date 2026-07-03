import { Component } from '@angular/core';
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

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  protected email = '';
  protected password = '';
  protected isPasswordVisible = false;
  protected isLoading = false;
  protected errorMessage = '';

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
}
