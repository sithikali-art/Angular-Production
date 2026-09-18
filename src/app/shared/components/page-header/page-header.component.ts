import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  /** The main header title */
  readonly title = input.required<string>();

  /** Optional subtitle or description text */
  readonly subtitle = input<string>();
}
