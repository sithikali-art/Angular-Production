import { Type } from '@angular/core';

import { ActivityChartComponent } from '../../shared/components/activity-chart/activity-chart.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { FundingBarComponent } from '../../shared/components/funding-bar/funding-bar.component';
import { RecentActivityComponent } from '../../shared/components/recent-activity/recent-activity.component';
import { StatusPopoverComponent } from '../../shared/components/status-popover/status-popover.component';
import { WalletBalanceCardComponent } from '../../shared/components/wallet-balance-card/wallet-balance-card.component';
import { WalletSelectorComponent } from '../../shared/components/wallet-selector/wallet-selector.component';
import { AccordionComponent } from '../../shared/ui/accordion/accordion.component';
import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { DrawerComponent } from '../../shared/ui/drawer/drawer.component';
import { FlagIconComponent } from '../../shared/ui/flag-icon/flag-icon.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { ModalComponent } from '../../shared/ui/modal/modal.component';
import { ToggleSwitchComponent } from '../../shared/ui/toggle-switch/toggle-switch.component';

/** One showcased component in /component-library. */
export interface LibraryEntry {
  /** URL id, e.g. 'wallet-balance-card'. Display name is derived from it. */
  id: string;
  component: Type<unknown>;
  description: string;
  category: 'Component' | 'UI kit';
  /** Inputs bound to the live preview (NgComponentOutlet). */
  sampleInputs?: Record<string, unknown>;
  /** Example Angular usage shown (and copyable) on the detail page. */
  example: string;
  /**
   * Full-screen overlay components (drawer, modal) are not auto-rendered
   * in the grid — the detail page offers an interactive live preview.
   */
  overlay?: boolean;
}

/** Selector / inputs / outputs read from the compiled component definition. */
export interface ComponentMeta {
  selector: string;
  inputs: string[];
  outputs: string[];
}

/**
 * Runtime reflection over Angular's component definition — the registry
 * never hand-maintains selectors or input/output lists, so they stay in
 * sync with the source automatically.
 */
export function componentMeta(component: Type<unknown>): ComponentMeta {
  const def = (component as unknown as { ɵcmp?: Record<string, unknown> }).ɵcmp;
  const selectors = (def?.['selectors'] as string[][] | undefined) ?? [];
  return {
    selector: String(selectors[0]?.[0] ?? ''),
    inputs: Object.keys((def?.['inputs'] as object | undefined) ?? {}),
    outputs: Object.keys((def?.['outputs'] as object | undefined) ?? {}),
  };
}

/** 'wallet-balance-card' -> 'Wallet Balance Card' */
export function displayName(id: string): string {
  return id
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * The library. To showcase a new shared component, add ONE entry here —
 * name, selector, inputs and outputs are derived automatically and the
 * grid/detail pages pick it up.
 */
export const COMPONENT_LIBRARY: LibraryEntry[] = [
  /* ---------- Feature components (src/app/shared/components) ---------- */
  {
    id: 'activity-chart',
    component: ActivityChartComponent,
    category: 'Component',
    description:
      'Credits/debits activity chart with line and bar modes, hover tooltips and per-wallet series. Reads the selected wallet from WalletStateService.',
    example: `<app-activity-chart />`,
  },
  {
    id: 'data-table',
    component: DataTableComponent,
    category: 'Component',
    description:
      'Reusable table: column config via input, per-column cell templates (appTableCell), optional expandable detail rows (appTableExpanded) and a row actions menu.',
    sampleInputs: {
      columns: [
        { key: 'name', label: 'Name', width: '40%' },
        { key: 'role', label: 'Role', width: '35%' },
        { key: 'status', label: 'Status', align: 'right' },
      ],
      rows: [
        { name: 'Jeganathan Raghavan', role: 'Administrator', status: 'Active' },
        { name: 'Sathish Kumar S', role: 'Entity Admin', status: 'Active' },
        { name: 'Rachel Crane', role: 'Approver', status: 'Invited' },
      ],
      rowKey: 'name',
    },
    example: `<app-data-table [columns]="columns" [rows]="rows()" rowKey="id" [showRowMenu]="true">
  <ng-template appTableCell="name" let-row>
    <strong>{{ row.name }}</strong>
  </ng-template>
  <ng-template appTableExpanded let-row>
    Detail panel for {{ row.name }}
  </ng-template>
</app-data-table>`,
  },
  {
    id: 'funding-bar',
    component: FundingBarComponent,
    category: 'Component',
    description:
      'Funding bank account strip: account selector, funding method, masked account number with show/hide and routing details.',
    example: `<app-funding-bar />`,
  },
  {
    id: 'recent-activity',
    component: RecentActivityComponent,
    category: 'Component',
    description:
      'Recent wallet transactions list with counterparty avatars, direction badges and running balances for the selected wallet.',
    example: `<app-recent-activity />`,
  },
  {
    id: 'status-popover',
    component: StatusPopoverComponent,
    category: 'Component',
    description:
      'Company status chip that opens the "Company status" panel (identity level, payment approvals, connected services).',
    example: `<app-status-popover />`,
  },
  {
    id: 'wallet-balance-card',
    component: WalletBalanceCardComponent,
    category: 'Component',
    description:
      'Gradient wallet balance hero card with the rotating wireframe globe and the embedded wallet switcher.',
    example: `<app-wallet-balance-card />`,
  },
  {
    id: 'wallet-selector',
    component: WalletSelectorComponent,
    category: 'Component',
    description:
      'Wallet switcher dropdown: flag, name, wallet ID, per-wallet balances and the "View details" action that opens the wallet drawer.',
    example: `<app-wallet-selector />`,
  },

  /* ------------------- UI kit (src/app/shared/ui) ------------------- */
  {
    id: 'accordion',
    component: AccordionComponent,
    category: 'UI kit',
    description:
      'Collapsible panel with icon, title and subtitle header; any content is projected into the body. Used for "Add entity" on the Organization page.',
    sampleInputs: {
      title: 'Add entity',
      subtitle: 'Add a regional office, subsidiary, or additional business entity.',
      icon: 'plus',
      isOpen: false,
    },
    example: `<app-accordion icon="plus" title="Add entity" subtitle="Add a business entity.">
  <p>Projected body content…</p>
</app-accordion>`,
  },
  {
    id: 'avatar',
    component: AvatarComponent,
    category: 'UI kit',
    description: 'Initials avatar generated from a display name, with configurable size.',
    sampleInputs: { name: 'Jegan Raghavan', size: 48 },
    example: `<app-avatar [name]="user.name" [size]="48" />`,
  },
  {
    id: 'badge',
    component: BadgeComponent,
    category: 'UI kit',
    description:
      'Status badge in text, icon-text or number form with success / primary / warning / danger / secondary variants.',
    sampleInputs: {
      badgeText: 'Active',
      badgeVariant: 'success',
      badgeType: 'icon-text',
      icon: 'point-filled',
    },
    example: `<app-badge badgeType="icon-text" icon="point-filled" badgeText="Active" badgeVariant="success" />`,
  },
  {
    id: 'button',
    component: ButtonComponent,
    category: 'UI kit',
    description:
      'App button wrapping the design-system .btn styles: variants (primary, soft, ghost, cancel…), optional icon on either side, submit support and disabled state.',
    sampleInputs: { btnText: 'Add entity', btnVariant: 'primary', icon: 'plus' },
    example: `<app-button btnVariant="primary" btnText="Add entity" icon="plus" (click)="add()" />`,
  },
  {
    id: 'drawer',
    component: DrawerComponent,
    category: 'UI kit',
    description:
      'Right-hand slide-over shell with backdrop, header (icon, title, subtitle) and close affordances. Content is projected. Used by the Drafts, Approvals and Wallet Details drawers.',
    overlay: true,
    example: `<app-drawer title="Wallet details" subtitle="Wallet ID 982734" icon="wallet" (closed)="close()">
  …drawer content…
</app-drawer>`,
  },
  {
    id: 'flag-icon',
    component: FlagIconComponent,
    category: 'UI kit',
    description: 'Circular 20×20 country flag image (object-fit: cover) from a country code.',
    sampleInputs: { countryCode: 'US', size: 28 },
    example: `<app-flag-icon countryCode="US" [size]="20" />`,
  },
  {
    id: 'icon',
    component: IconComponent,
    category: 'UI kit',
    description:
      'Tabler Icons webfont wrapper — renders <i class="ti ti-…">, inherits currentColor, maps legacy names.',
    sampleInputs: { name: 'wallet', size: 30 },
    example: `<app-icon name="wallet" [size]="16" />`,
  },
  {
    id: 'modal',
    component: ModalComponent,
    category: 'UI kit',
    description:
      'Bootstrap-styled modal with backdrop, sizes (sm–fullscreen), centered/scrollable options, Escape/backdrop close and a projected footer. Used for Delete draft and Edit entity.',
    overlay: true,
    example: `<app-modal [isOpen]="open()" title="Edit entity" size="lg" (closeModal)="open.set(false)">
  …modal body…
  <span modal-footer>
    <app-button btnVariant="cancel" btnText="Cancel" (click)="open.set(false)" />
    <app-button btnVariant="primary" btnText="Save changes" (click)="save()" />
  </span>
</app-modal>`,
  },
  {
    id: 'toggle-switch',
    component: ToggleSwitchComponent,
    category: 'UI kit',
    description: 'Compact on/off switch used in the appearance panel (e.g. dark mode).',
    sampleInputs: { checked: true },
    example: `<app-toggle-switch [checked]="darkMode()" />`,
  },
];
