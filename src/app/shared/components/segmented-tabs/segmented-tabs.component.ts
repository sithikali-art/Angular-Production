import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface TabOption {
  id: string;
  label: string;
  count?: number;
}

@Component({
  selector: 'app-segmented-tabs',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './segmented-tabs.component.html',
  styleUrl: './segmented-tabs.component.scss',
})
export class SegmentedTabsComponent {
  /** Array of tab configuration options */
  readonly tabs = input.required<TabOption[]>();

  /** Two-way bindable signal active tab state */
  readonly activeTab = model.required<string>();

  selectTab(tabId: string): void {
    this.activeTab.set(tabId);
  }
}
