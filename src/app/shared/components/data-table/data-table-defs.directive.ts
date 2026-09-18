import { Directive, TemplateRef, inject, input } from '@angular/core';

/**
 * Custom cell template for one column of <app-data-table>.
 * Usage inside the table's content:
 *
 *   <ng-template appTableCell="entity" let-row>
 *     ...custom markup for the "entity" column...
 *   </ng-template>
 *
 * Columns without a matching template fall back to plain text
 * rendered from the row's property named by the column key.
 */
@Directive({ selector: 'ng-template[appTableCell]' })
export class TableCellDefDirective {
  /** Column key this template renders. */
  readonly appTableCell = input.required<string>();
  readonly template = inject(TemplateRef);
}

/**
 * Expanded-row detail template for <app-data-table>. When present the
 * table renders an expand chevron per row and shows this template in a
 * full-width panel under the expanded row (one row at a time).
 *
 *   <ng-template appTableExpanded let-row>...detail panel...</ng-template>
 */
@Directive({ selector: 'ng-template[appTableExpanded]' })
export class TableExpandedDefDirective {
  readonly template = inject(TemplateRef);
}
