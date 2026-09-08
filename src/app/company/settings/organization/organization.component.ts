import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MOCK_COMPANY } from '../../../core/mock/mock-data';
import { CompanyEntity, OrganizationUser } from '../../../core/models';
import { OrganizationApiService } from '../../../core/services/organization-api.service';
import {
  DataTableColumn,
  DataTableComponent,
} from '../../../shared/components/data-table/data-table.component';
import {
  TableCellDefDirective,
  TableExpandedDefDirective,
} from '../../../shared/components/data-table/data-table-defs.directive';
import { AccordionComponent } from '../../../shared/ui/accordion/accordion.component';
import { AvatarComponent } from '../../../shared/ui/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';

type SettingsTab = 'profile' | 'users' | 'entities';

/**
 * /settings — Organization page (Profile / Users / Entities tabs).
 * Composes the shared UI kit: app-accordion (Add entity), app-button,
 * app-badge (status / PRIME), app-modal (Edit entity) and the reusable
 * app-data-table (Entities with expandable detail panel, Users).
 */
@Component({
  selector: 'app-organization',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterLink,
    DataTableComponent,
    TableCellDefDirective,
    TableExpandedDefDirective,
    AccordionComponent,
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    ModalComponent,
  ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss',
})
export class OrganizationComponent {
  private readonly orgApi = inject(OrganizationApiService);

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

  /* --- Add entity (app-accordion inline form) --- */
  newName = '';
  newType = 'Subsidiary';
  newLocation = '';
  newFunction = '';

  /* --- Edit entity (app-modal) --- */
  readonly editOpen = signal(false);
  private editingId: string | null = null;
  editName = '';
  editType = 'Subsidiary';
  editLocation = '';
  editFunction = '';
  editNotes = '';

  constructor() {
    this.orgApi.getEntities().subscribe((rows) => this.entities.set(rows));
    this.orgApi.getUsers().subscribe((rows) => this.users.set(rows));
  }

  setTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
  }

  addEntity(): void {
    const name = this.newName.trim();
    if (!name) {
      return;
    }
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
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
      createdOn: today,
      lastUpdated: today,
      notes: '',
    };
    this.entities.update((rows) => [...rows, entity]);
    this.cancelAdd();
  }

  cancelAdd(): void {
    this.newName = '';
    this.newType = 'Subsidiary';
    this.newLocation = '';
    this.newFunction = '';
  }

  openEdit(entity: CompanyEntity): void {
    this.editingId = entity.entityId;
    this.editName = entity.name;
    this.editType = entity.entityType;
    this.editLocation = entity.location;
    this.editFunction = entity.businessFunction;
    this.editNotes = entity.notes;
    this.editOpen.set(true);
  }

  closeEdit(): void {
    this.editOpen.set(false);
    this.editingId = null;
  }

  saveEdit(): void {
    const id = this.editingId;
    const name = this.editName.trim();
    if (!id || !name) {
      return;
    }
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    this.entities.update((rows) =>
      rows.map((row) =>
        row.entityId === id
          ? {
              ...row,
              name,
              entityType: this.editType,
              location: this.editLocation.trim() || '—',
              businessFunction: this.editFunction.trim() || '—',
              notes: this.editNotes.trim(),
              lastUpdated: today,
            }
          : row,
      ),
    );
    this.closeEdit();
  }
}
