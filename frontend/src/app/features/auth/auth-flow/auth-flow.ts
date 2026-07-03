import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Globe2,
  KeyRound,
  LockKeyhole,
  LucideAngularModule,
  Mail,
  RefreshCw,
  ShieldCheck,
  Smartphone
} from 'lucide-angular';

import { environment } from '../../../../environments/environment';
import { AuthUiFlowService } from '../../../core/services/auth-ui-flow.service';

type AuthScreen =
  | 'forgot'
  | 'verify'
  | 'reset'
  | 'success'
  | 'two-factor'
  | 'social';

type SocialProvider = 'google' | 'facebook' | 'apple';

@Component({
  selector: 'app-auth-flow',
  imports: [FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './auth-flow.html',
  styleUrl: './auth-flow.scss'
})
export class AuthFlowComponent implements OnInit {
  protected screen: AuthScreen = 'forgot';
  protected flow = 'password';
  protected provider: SocialProvider = 'google';

  protected email = '';
  protected otpDigits = ['', '', '', '', '', ''];
  protected newPassword = '';
  protected confirmPassword = '';

  protected isPasswordVisible = false;
  protected isConfirmPasswordVisible = false;
  protected errorMessage = '';
  protected infoMessage = '';

  protected readonly isPreviewMode = environment.localMock.enabled;

  protected readonly backIcon = ArrowLeft;
  protected readonly nextIcon = ArrowRight;
  protected readonly emailIcon = Mail;
  protected readonly passwordIcon = LockKeyhole;
  protected readonly visibleIcon = Eye;
  protected readonly hiddenIcon = EyeOff;
  protected readonly alertIcon = CircleAlert;
  protected readonly successIcon = CircleCheck;
  protected readonly secureIcon = ShieldCheck;
  protected readonly resendIcon = RefreshCw;
  protected readonly keyIcon = KeyRound;
  protected readonly phoneIcon = Smartphone;
  protected readonly socialIcon = Globe2;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authFlowState: AuthUiFlowService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.screen = (data['authScreen'] as AuthScreen) || 'forgot';
    });

    this.route.paramMap.subscribe((params) => {
      const provider = params.get('provider');

      if (provider) {
        this.provider = this.normalizeProvider(provider);
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      this.flow = params.get('flow') || 'password';

      const queryEmail = params.get('email');

      if (queryEmail) {
        this.email = queryEmail;
        this.authFlowState.rememberEmail(queryEmail);
      } else {
        this.email = this.authFlowState.getRememberedEmail();
      }
    });
  }

  protected get otpCode(): string {
    return this.otpDigits.join('');
  }

  protected get maskedEmail(): string {
    return this.authFlowState.maskEmail(this.email);
  }

  protected get providerLabel(): string {
    if (this.provider === 'facebook') {
      return 'Facebook';
    }

    if (this.provider === 'apple') {
      return 'Apple';
    }

    return 'Google';
  }

  protected get providerMark(): string {
    if (this.provider === 'facebook') {
      return 'f';
    }

    if (this.provider === 'apple') {
      return 'A';
    }

    return 'G';
  }

  protected get verificationTitle(): string {
    return this.flow === 'account' ? 'Verify your email' : 'Enter verification code';
  }

  protected get verificationDescription(): string {
    if (this.flow === 'account') {
      return `Enter the six-digit code sent to ${this.maskedEmail} to activate your workspace.`;
    }

    return `Enter the six-digit code sent to ${this.maskedEmail} to continue password recovery.`;
  }

  protected get successTitle(): string {
    if (this.flow === 'account') {
      return 'Email verification complete';
    }

    if (this.flow === 'two-factor') {
      return 'Two-step verification complete';
    }

    return 'Password reset complete';
  }

  protected get successDescription(): string {
    if (this.flow === 'account') {
      return 'Your workspace email is ready for secure account access.';
    }

    if (this.flow === 'two-factor') {
      return 'Your additional verification step has been completed.';
    }

    return 'You can now use your new password to sign in to StockFlow.';
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  protected handleForgotPassword(): void {
    this.errorMessage = '';
    this.infoMessage = '';

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Enter a valid email address to continue.';
      return;
    }

    this.authFlowState.rememberEmail(this.email);

    this.router.navigate(['/auth/verify-email'], {
      queryParams: {
        flow: 'password',
        email: this.email
      }
    });
  }

  protected onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);

    this.otpDigits[index] = value;
    input.value = value;
    this.errorMessage = '';

    if (value && index < this.otpDigits.length - 1) {
      document.getElementById(`auth-otp-${index + 1}`)?.focus();
    }
  }

  protected onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      document.getElementById(`auth-otp-${index - 1}`)?.focus();
    }
  }

  protected handleVerification(): void {
    this.errorMessage = '';
    this.infoMessage = '';

    if (this.otpCode.length !== 6) {
      this.errorMessage = 'Enter the full six-digit verification code.';
      return;
    }

    if (this.flow === 'account') {
      this.router.navigate(['/auth/success'], {
        queryParams: { flow: 'account' }
      });
      return;
    }

    this.router.navigate(['/auth/reset-password'], {
      queryParams: { email: this.email }
    });
  }

  protected handleResend(): void {
    this.errorMessage = '';
    this.infoMessage = this.isPreviewMode
      ? 'Preview mode: a verification code was not sent.'
      : 'A new code will be sent when email delivery is connected.';
  }

  protected handleResetPassword(): void {
    this.errorMessage = '';
    this.infoMessage = '';

    if (this.newPassword.length < 8) {
      this.errorMessage = 'Use at least eight characters for the new password.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'The two passwords do not match.';
      return;
    }

    this.router.navigate(['/auth/success'], {
      queryParams: { flow: 'password' }
    });
  }

  protected handleTwoFactor(): void {
    this.errorMessage = '';
    this.infoMessage = '';

    if (this.otpCode.length !== 6) {
      this.errorMessage = 'Enter the six-digit code from your authenticator app.';
      return;
    }

    this.router.navigate(['/auth/success'], {
      queryParams: { flow: 'two-factor' }
    });
  }

  protected handleSocialContinue(): void {
    this.errorMessage = '';
    this.infoMessage =
      `${this.providerLabel} authentication will be connected after provider credentials and backend callback routes are added.`;
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  private normalizeProvider(provider: string): SocialProvider {
    if (provider === 'facebook' || provider === 'apple' || provider === 'google') {
      return provider;
    }

    return 'google';
  }
}
