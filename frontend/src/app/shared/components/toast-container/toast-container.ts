import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  LucideAngularModule,
  X
} from 'lucide-angular';

import { ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [AsyncPipe, LucideAngularModule],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss'
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);

  protected readonly toasts$ = this.toastService.toasts$;

  protected readonly successIcon = CheckCircle2;
  protected readonly errorIcon = AlertCircle;
  protected readonly infoIcon = Info;
  protected readonly warningIcon = AlertTriangle;
  protected readonly closeIcon = X;

  protected dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  protected getIcon(type: ToastType): any {
    const iconMap: Record<ToastType, any> = {
      success: this.successIcon,
      error: this.errorIcon,
      info: this.infoIcon,
      warning: this.warningIcon
    };

    return iconMap[type];
  }
}
