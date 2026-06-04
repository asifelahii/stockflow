import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  templateUrl: './placeholder-page.html',
  styleUrl: './placeholder-page.scss'
})
export class PlaceholderPageComponent {
  protected readonly title: string;
  protected readonly description: string;

  constructor(private readonly route: ActivatedRoute) {
    this.title = this.route.snapshot.data['title'] ?? 'Page';
    this.description =
      this.route.snapshot.data['description'] ??
      'This page will be implemented in the next frontend phase.';
  }
}
