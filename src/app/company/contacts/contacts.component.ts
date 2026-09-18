import { Component, signal } from '@angular/core';
import { SegmentedTabsComponent, TabOption } from '../../shared/components/segmented-tabs/segmented-tabs.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-contacts',
  imports: [SegmentedTabsComponent, PageHeaderComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  // Define tab configuration
  readonly contactTabs: TabOption[] = [
    { id: 'individuals', label: 'Individuals' },
    { id: 'companies', label: 'Companies' },
  ];

  // Store the active tab ID in a signal
  readonly selectedTab = signal<string>('individuals');
}
