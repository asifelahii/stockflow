import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = '0x4AAAAAADkqiUhClc-qUzaE';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('turnstileContainer')
  private turnstileContainer?: ElementRef<HTMLDivElement>;

  protected fullName = '';
  protected businessName = '';
  protected email = '';
  protected password = '';
  protected turnstileToken = '';
  protected isTurnstileReady = false;
  protected isLoading = false;
  protected errorMessage = '';
  protected successMessage = '';

  private turnstileWidgetId?: string;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.loadTurnstileScript()
      .then(() => this.renderTurnstile())
      .catch(() => {
        this.ngZone.run(() => {
          this.errorMessage = 'Bot verification could not be loaded. Please refresh the page.';
        });
      });
  }

  ngOnDestroy(): void {
    if (this.turnstileWidgetId && window.turnstile) {
      window.turnstile.remove(this.turnstileWidgetId);
    }
  }

  handleRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.fullName.trim() ||
      !this.businessName.trim() ||
      !this.email.trim() ||
      !this.password
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (!this.turnstileToken) {
      this.errorMessage = 'Please complete the bot verification.';
      return;
    }

    this.isLoading = true;

    this.authService.register({
      full_name: this.fullName.trim(),
      organization_name: this.businessName.trim(),
      email: this.email.trim(),
      password: this.password,
      turnstile_token: this.turnstileToken
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Business workspace created successfully. Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 800);
      },
      error: (error) => {
        this.isLoading = false;
        this.resetTurnstile();
        this.errorMessage =
          error?.error?.detail || 'Registration failed. Please try again.';
      }
    });
  }

  private loadTurnstileScript(): Promise<void> {
    if (window.turnstile) {
      return Promise.resolve();
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="challenges.cloudflare.com/turnstile"]'
    );

    if (existingScript) {
      return new Promise((resolve, reject) => {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject());
      });
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject();

      document.head.appendChild(script);
    });
  }

  private renderTurnstile(): void {
    if (!this.turnstileContainer?.nativeElement || !window.turnstile) {
      return;
    }

    this.turnstileWidgetId = window.turnstile.render(
      this.turnstileContainer.nativeElement,
      {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          this.ngZone.run(() => {
            this.turnstileToken = token;
            this.errorMessage = '';
          });
        },
        'expired-callback': () => {
          this.ngZone.run(() => {
            this.turnstileToken = '';
          });
        },
        'error-callback': () => {
          this.ngZone.run(() => {
            this.turnstileToken = '';
            this.errorMessage = 'Bot verification failed. Please refresh and try again.';
          });
        }
      }
    );

    this.ngZone.run(() => {
      this.isTurnstileReady = true;
    });
  }

  private resetTurnstile(): void {
    this.turnstileToken = '';

    if (this.turnstileWidgetId && window.turnstile) {
      window.turnstile.reset(this.turnstileWidgetId);
    }
  }
}
