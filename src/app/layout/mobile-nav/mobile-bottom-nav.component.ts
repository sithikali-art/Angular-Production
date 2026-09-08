import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { LayoutUiStateService } from '../../core/state/layout-ui-state.service';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/**
 * Fixed bottom navigation shown at tablet/phone widths (≤1024px):
 * Home · Wallets · Pay · More. "More" opens the full sidebar as a
 * slide-in overlay so every route stays reachable on mobile.
 */
@Component({
  selector: 'app-mobile-bottom-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './mobile-bottom-nav.component.html',
  styleUrl: './mobile-bottom-nav.component.scss',
})
export class MobileBottomNavComponent {
  private readonly router = inject(Router);
  readonly layoutUi = inject(LayoutUiStateService);

  isPayActive(): boolean {
    return this.router.url.startsWith('/pay');
  }

  toggleMore(): void {
    this.layoutUi.mobileNavOpen.update((open) => !open);
  }
}
