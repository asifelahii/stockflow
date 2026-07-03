import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthUiFlowService {
  private readonly emailStorageKey = 'stockflow-auth-flow-email';

  rememberEmail(email: string): void {
    sessionStorage.setItem(this.emailStorageKey, email.trim());
  }

  getRememberedEmail(): string {
    return sessionStorage.getItem(this.emailStorageKey) || '';
  }

  clearRememberedEmail(): void {
    sessionStorage.removeItem(this.emailStorageKey);
  }

  maskEmail(email: string): string {
    const [username, domain] = email.split('@');

    if (!username || !domain) {
      return email || 'your email address';
    }

    const visiblePrefix = username.slice(0, Math.min(2, username.length));
    return `${visiblePrefix}${'*'.repeat(Math.max(2, username.length - visiblePrefix.length))}@${domain}`;
  }
}
