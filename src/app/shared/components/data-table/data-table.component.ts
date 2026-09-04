import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChild,
  contentChildren,
  input,
  output,
  signal,
} from '@angular/core';

import { IconComponent } from '../../ui/icon/icon.component';
import { TableCellDefDirective, TableExpandedDefDirective } from './data-table-defs.directive';

/** Column definition consumed by <app-data-table>. */
export interface DataTableColumn {
  /** Row property to read when no custom cell template is provided. */
  key: string;
  /** Header label (rendered uppercase, overline style). */
  label: string;
  /** Optional fixed/percentage width, e.g. '32%' or '160px'. */
  width?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Reusable table shared across pages (Organization entities, users, …).
 *
 *  - Columns are configured via the `columns` input.
 *  - Cell markup is customised per column with `ng-template appTableCell="key"`;
 *    columns without a template render the row property named by the key.
 *  - Providing an `ng-template appTableExpanded` makes rows expandable
 *    (accordion — one open at a time) with a chevron toggle per row.
 *  - `showRowMenu` renders a ⋮ button that emits `rowMenu`.
 */
@Component({
  selector: 'app-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, IconComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T extends object> {
  readonly columns = input.required<DataTableColumn[]>();
  readonly rows = input.required<T[]>();
  /** Row property that uniquely identifies a row (for tracking/expansion). */
  readonly rowKey = input.required<string>();
  /** Render the ⋮ actions button in the trailing cell. */
  readonly showRowMenu = input(false);
  readonly emptyMessage = input('No records to display.');

  readonly rowMenu = output<T>();

  private readonly cellDefs = contentChildren(TableCellDefDirective);
  private readonly expandedDef = contentChild(TableExpandedDefDirective);

  private readonly cellTemplates = computed(() => {
    const map = new Map<string, TemplateRef<unknown>>();
    for (const def of this.cellDefs()) {
      map.set(def.appTableCell(), def.template);
    }
    return map;
  });

  readonly expandable = computed(() => !!this.expandedDef());
  readonly expandedTemplate = computed(() => this.expandedDef()?.template ?? null);
  readonly expandedKey = signal<unknown>(null);

  cellTemplate(key: string): TemplateRef<unknown> | null {
    return this.cellTemplates().get(key) ?? null;
  }

  keyOf(row: T): unknown {
    return (row as Record<string, unknown>)[this.rowKey()];
  }

  cellValue(row: T, key: string): string {
    const value = (row as Record<string, unknown>)[key];
    return value === null || value === undefined ? '' : String(value);
  }

  isExpanded(row: T): boolean {
    return this.expandedKey() === this.keyOf(row);
  }

  toggle(row: T): void {
    if (!this.expandable()) {
      return;
    }
    this.expandedKey.update((key) => (key === this.keyOf(row) ? null : this.keyOf(row)));
  }
}
