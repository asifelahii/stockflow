import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  LucideAngularModule
} from 'lucide-angular';

import { APP_NAVIGATION } from '../../../core/navigation/app-navigation.config';
import { WorkspaceContextService } from '../../../core/workspace/workspace-context.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapseToggled = new EventEmitter<void>();

  protected readonly collapseIcon = ChevronLeft;
  protected readonly expandIcon = ChevronRight;
  protected readonly workspaceIcon = Building2;
  protected readonly sections = APP_NAVIGATION;

  constructor(private readonly workspaceContext: WorkspaceContextService) {}

  protected get workspaceName(): string {
    return this.workspaceContext.workspaceName();
  }

  protected get workspaceInitial(): string {
    return this.workspaceContext.workspaceInitial();
  }

  protected toggleCollapse(): void {
    this.collapseToggled.emit();
  }
}
