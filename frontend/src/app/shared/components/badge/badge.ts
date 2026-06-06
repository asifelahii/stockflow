import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.html',
  styleUrl: './badge.scss'
})
export class BadgeComponent {
  @Input() label = '';
  @Input() tone: 'success' | 'danger' | 'warning' | 'info' | 'neutral' = 'neutral';
}
