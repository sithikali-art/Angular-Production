import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeStateService } from './core/state/theme-state.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  // Instantiate eagerly so the persisted palette/mode is applied on boot.
  private readonly theme = inject(ThemeStateService);
}
