import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-drawer',
  imports: [LucideAngularModule],
  templateUrl: './drawer.html',
  styleUrl: './drawer.scss'
})
export class DrawerComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() description = '';

  @Output() closed = new EventEmitter<void>();

  protected readonly closeIcon = X;

  protected close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open) {
      this.close();
    }
  }
}
