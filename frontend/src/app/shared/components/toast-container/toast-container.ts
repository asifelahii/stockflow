import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  LucideAngularModule,
  X
} from 'lucide-angular';

import { ToastMessage, ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [AsyncPipe, LucideAngularModule],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss'
})
export class ToastContainerComponent {
  protected readonly toasts$ = this.toastService.toasts$;

  protected readonly successIcon = CheckCircle2;
  protected readonly errorIcon = AlertCircle;
  protected readonly infoIcon = Info;
  protected readonly warningIcon = AlertTriangle;
  protected readonly closeIcon = X;

  constructor(private readonly toastService: ToastService) {}

  protected dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  protected getIcon(type: ToastType): unknown {
    const iconMap: Record<ToastType, unknown> = {
      success: this.successIcon,
      error: this.errorIcon,
      info: this.infoIcon,
      warning: this.warningIcon
    };

    return iconMap[type];
  }
}
