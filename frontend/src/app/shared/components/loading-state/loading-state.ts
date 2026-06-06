import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.html',
  styleUrl: './loading-state.scss'
})
export class LoadingStateComponent {
  @Input() message = 'Loading data...';
}
