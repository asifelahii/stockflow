import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<ToastMessage[]>([]);

  readonly toasts$ = this.toastSubject.asObservable();

  success(title: string, message?: string): void {
    this.show('success', title, message);
  }

  error(title: string, message?: string): void {
    this.show('error', title, message);
  }

  info(title: string, message?: string): void {
    this.show('info', title, message);
  }

  warning(title: string, message?: string): void {
    this.show('warning', title, message);
  }

  dismiss(id: number): void {
    this.toastSubject.next(this.toastSubject.value.filter((toast) => toast.id !== id));
  }

  private show(type: ToastType, title: string, message?: string): void {
    const toast: ToastMessage = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type,
      title,
      message
    };

    this.toastSubject.next([...this.toastSubject.value, toast]);

    window.setTimeout(() => {
      this.dismiss(toast.id);
    }, 3500);
  }
}
