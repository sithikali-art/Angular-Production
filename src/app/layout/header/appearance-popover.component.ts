import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LayoutUiStateService } from '../../core/state/layout-ui-state.service';
import { ThemeStateService } from '../../core/state/theme-state.service';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/**
 * Image 3 — "Appearance" popover: palette list + light/dark mode.
 * Selection is applied instantly through ThemeStateService.
 */
@Component({
  selector: 'app-appearance-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './appearance-popover.component.html',
  styleUrl: './appearance-popover.component.scss',
})
export class AppearancePopoverComponent {
  readonly theme = inject(ThemeStateService);
  readonly layoutUi = inject(LayoutUiStateService);
}
