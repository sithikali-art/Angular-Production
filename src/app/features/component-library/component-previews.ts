/**
 * OPTIONAL per-component preview settings for /component-library, keyed by
 * the component's folder name under shared/components.
 *
 * A new shared component appears in the library automatically (see
 * tools/generate-component-library.mjs) — add an entry here ONLY when it
 * needs one of:
 *   - sampleInputs: values for its inputs (REQUIRED inputs must get one,
 *     otherwise the live preview cannot render),
 *   - example: a richer usage snippet than the default `<selector />`,
 *   - overlay: true for full-screen components (drawer/modal) that should
 *     be demoed interactively on the detail page instead of auto-rendered.
 */
export interface ComponentPreview {
  sampleInputs?: Record<string, unknown>;
  example?: string;
  overlay?: boolean;
}

export const COMPONENT_PREVIEWS: Record<string, ComponentPreview> = {
  'data-table': {
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

  accordion: {
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

  avatar: {
    sampleInputs: { name: 'Jegan Raghavan', size: 48 },
    example: `<app-avatar [name]="user.name" [size]="48" />`,
  },

  badge: {
    sampleInputs: {
      badgeText: 'Active',
      badgeVariant: 'success',
      badgeType: 'icon-text',
      icon: 'point-filled',
    },
    example: `<app-badge badgeType="icon-text" icon="point-filled" badgeText="Active" badgeVariant="success" />`,
  },

  button: {
    sampleInputs: { btnText: 'Add entity', btnVariant: 'primary', icon: 'plus' },
    example: `<app-button btnVariant="primary" btnText="Add entity" icon="plus" (click)="add()" />`,
  },

  drawer: {
    overlay: true,
    example: `<app-drawer title="Wallet details" subtitle="Wallet ID 982734" icon="wallet" (closed)="close()">
  …drawer content…
</app-drawer>`,
  },

  'flag-icon': {
    sampleInputs: { countryCode: 'US', size: 28 },
    example: `<app-flag-icon countryCode="US" [size]="20" />`,
  },

  icon: {
    sampleInputs: { name: 'wallet', size: 30 },
    example: `<app-icon name="wallet" [size]="16" />`,
  },

  modal: {
    overlay: true,
    example: `<app-modal [isOpen]="open()" title="Edit entity" size="lg" (closeModal)="open.set(false)">
  …modal body…
  <span modal-footer>
    <app-button btnVariant="cancel" btnText="Cancel" (click)="open.set(false)" />
    <app-button btnVariant="primary" btnText="Save changes" (click)="save()" />
  </span>
</app-modal>`,
  },
  'toggle-switch': {
    sampleInputs: { checked: true },
    example: `<app-toggle-switch [checked]="darkMode()" />`,
  },

  'checkbox-group': {
    sampleInputs: {
      options: [
        { label: 'Email notifications', value: 'email' },
        { label: 'SMS alerts', value: 'sms' },
        { label: 'Push notifications', value: 'push' },
      ],
      value: ['email'],
    },
    example: `<app-checkbox-group [options]="options" [(value)]="selected" />`,
  },

  dropdown: {
    sampleInputs: {
      label: 'Funding method',
      options: [
        { label: 'ACH', value: 'ach' },
        { label: 'Wire', value: 'wire' },
        { label: 'RTP', value: 'rtp' },
      ],
      value: 'ach',
    },
    example: `<app-dropdown label="Funding method" [options]="options" [(value)]="method" />`,
  },

  'radio-group': {
    sampleInputs: {
      options: [
        { label: 'Standard (1-2 days)', value: 'standard' },
        { label: 'Instant', value: 'instant' },
      ],
      value: 'standard',
    },
    example: `<app-radio-group [options]="options" [(value)]="speed" />`,
  },

  'segmented-tabs': {
    sampleInputs: {
      tabs: [
        { id: 'line', label: 'Line' },
        { id: 'bar', label: 'Bar' },
      ],
      activeTab: 'bar',
    },
    example: `<app-segmented-tabs [tabs]="tabs" [(activeTab)]="active" />`,
  },

  stepper: {
    sampleInputs: {
      steps: [
        { id: 1, label: 'Amount' },
        { id: 2, label: 'Verification' },
        { id: 3, label: 'Payment' },
      ],
    },
    example: `<app-stepper [steps]="steps" />`,
  },

  'page-header': {
    sampleInputs: {
      title: 'Organization',
      subtitle: 'Manage company information, entities, users, and organization structure.',
    },
    example: `<app-page-header title="Organization" subtitle="Manage company information." />`,
  },

  'section-card': {
    sampleInputs: { title: 'Section title', icon: 'building-bank', badgeText: 'Optional' },
    example: `<app-section-card title="Section title" icon="building-bank">
  …projected body…
</app-section-card>`,
  },
};
