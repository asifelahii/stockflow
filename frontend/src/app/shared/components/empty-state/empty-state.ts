import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss'
})
export class EmptyStateComponent {
  @Input() title = 'No data found';
  @Input() message = 'There is nothing to show here yet.';
  @Input() actionLabel = '';
}
