import { Injectable, signal } from '@angular/core';

import { OrganizationSummary } from '../models/auth.model';

const ORGANIZATION_KEY = 'stockflow_current_organization';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceContextService {
  private readonly organizationState = signal<OrganizationSummary | null>(
    this.readStoredOrganization()
  );

  readonly organization = this.organizationState.asReadonly();

  setOrganization(organization: OrganizationSummary): void {
    this.organizationState.set(organization);
    localStorage.setItem(ORGANIZATION_KEY, JSON.stringify(organization));
  }

  clear(): void {
    this.organizationState.set(null);
    localStorage.removeItem(ORGANIZATION_KEY);
  }

  getCurrentOrganization(): OrganizationSummary | null {
    return this.organizationState();
  }

  workspaceName(fallback = 'Business Workspace'): string {
    return this.organizationState()?.name || fallback;
  }

  workspaceInitial(): string {
    return this.workspaceName()
      .trim()
      .charAt(0)
      .toUpperCase() || 'W';
  }

  private readStoredOrganization(): OrganizationSummary | null {
    const savedOrganization = localStorage.getItem(ORGANIZATION_KEY);

    if (!savedOrganization) {
      return null;
    }

    try {
      const organization = JSON.parse(savedOrganization) as Partial<OrganizationSummary>;

      if (
        typeof organization.id !== 'number' ||
        typeof organization.name !== 'string' ||
        typeof organization.role !== 'string'
      ) {
        localStorage.removeItem(ORGANIZATION_KEY);
        return null;
      }

      return {
        id: organization.id,
        name: organization.name,
        role: organization.role
      };
    } catch {
      localStorage.removeItem(ORGANIZATION_KEY);
      return null;
    }
  }
}
