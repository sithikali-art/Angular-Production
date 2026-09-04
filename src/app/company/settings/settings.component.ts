import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MOCK_COMPANY } from '../../core/mock/mock-data';
import { CompanyEntity, OrganizationUser } from '../../core/models';
import { OrganizationApiService } from '../../core/services/organization-api.service';
import {
  DataTableColumn,
  DataTableComponent,
} from '../../shared/components/data-table/data-table.component';
import {
  TableCellDefDirective,
  TableExpandedDefDirective,
} from '../../shared/components/data-table/data-table-defs.directive';
import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { AccordionComponent } from "../../shared/ui/accordion/accordion.component";

type SettingsTab = 'profile' | 'users' | 'entities';

/**
 * /settings — Organization page (Profile / Users / Entities tabs).
 * Both the Entities and Users tabs render the reusable
 * <app-data-table>; Entities adds an expandable detail panel.
 */
@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterLink,
    DataTableComponent,
    TableCellDefDirective,
    TableExpandedDefDirective,
    AvatarComponent,
    IconComponent,
    AccordionComponent
],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private readonly orgApi = inject(OrganizationApiService);

  // title:string="Add entity";
  // subtitle:string="Add a regional office, subsidiary, or additional business entity.";

  readonly company = MOCK_COMPANY;
  readonly activeTab = signal<SettingsTab>('entities');

  readonly tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: 'user' },
    { id: 'users', label: 'Users', icon: 'users' },
    { id: 'entities', label: 'Entities', icon: 'building-bank' },
  ];

  readonly entities = signal<CompanyEntity[]>([]);
  readonly users = signal<OrganizationUser[]>([]);

  readonly entityColumns: DataTableColumn[] = [
    { key: 'name', label: 'Entity', width: '34%' },
    { key: 'location', label: 'Location / Function', width: '30%' },
    { key: 'assignedUsers', label: 'Users', width: '14%' },
    { key: 'status', label: 'Status', align: 'right' },
  ];

  readonly userColumns: DataTableColumn[] = [
    { key: 'name', label: 'User', width: '38%' },
    { key: 'role', label: 'Role', width: '22%' },
    { key: 'entityName', label: 'Entity', width: '24%' },
    { key: 'status', label: 'Status', align: 'right' },
  ];

  /* --- Add entity (collapsible inline form) --- */
  readonly addOpen = signal(false);
  newName = '';
  newType = 'Subsidiary';
  newLocation = '';
  newFunction = '';

  constructor() {
    this.orgApi.getEntities().subscribe((rows) => this.entities.set(rows));
    this.orgApi.getUsers().subscribe((rows) => this.users.set(rows));
  }

  setTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
  }

  toggleAdd(): void {
    this.addOpen.update((open) => !open);
  }

  addEntity(): void {
    const name = this.newName.trim();
    if (!name) {
      return;
    }
    const entity: CompanyEntity = {
      entityId: `ent_${Date.now()}`,
      name,
      entityType: this.newType,
      prime: false,
      location: this.newLocation.trim() || '—',
      businessFunction: this.newFunction.trim() || '—',
      assignedUsers: 0,
      status: 'Active',
      entityAdmin: { name: 'Jeganathan Raghavan', email: 'jegan.raghavan@xtrm.com' },
      createdOn: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      lastUpdated: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      notes: '',
    };
    this.entities.update((rows) => [...rows, entity]);
    this.cancelAdd();
  }

  cancelAdd(): void {
    this.addOpen.set(false);
    this.newName = '';
    this.newType = 'Subsidiary';
    this.newLocation = '';
    this.newFunction = '';
  }
}
