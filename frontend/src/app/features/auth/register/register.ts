import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  protected fullName = '';
  protected email = '';
  protected password = '';
  protected isLoading = false;
  protected errorMessage = '';
  protected successMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  handleRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true;

    this.authService.register({
      full_name: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully. Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 800);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error?.error?.detail || 'Registration failed. Please try again.';
      }
    });
  }
}
