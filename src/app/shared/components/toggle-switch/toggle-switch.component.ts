import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** iOS-style toggle used by "Show only drafts created by me". */
@Component({
  selector: 'app-toggle-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.scss',
})
export class ToggleSwitchComponent {
  readonly checked = input(false);
  readonly toggled = output<void>();
}
