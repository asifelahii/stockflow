import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss'
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() actionLabel = '';
}
