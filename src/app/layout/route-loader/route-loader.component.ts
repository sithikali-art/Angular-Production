import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

/**
 * Full-page loading overlay with the rotating-square spinner (same look
 * as the initial app-load screen in index.html).
 *
 * Matches the reference app's behavior: instant navigations show NO
 * loader — the overlay only appears when a navigation is still pending
 * after a short delay (e.g. a lazy chunk on a slow connection), and it
 * hides the moment the navigation settles.
 */
@Component({
  selector: 'app-route-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './route-loader.component.html',
  styleUrl: './route-loader.component.scss',
})
export class RouteLoaderComponent {
  /** Navigations faster than this never show the loader. */
  private static readonly SHOW_DELAY_MS = 150;

  private readonly router = inject(Router);
  private showTimer: ReturnType<typeof setTimeout> | null = null;

  readonly loading = signal(false);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.clearTimer();
        this.showTimer = setTimeout(
          () => this.loading.set(true),
          RouteLoaderComponent.SHOW_DELAY_MS,
        );
        return;
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.clearTimer();
        this.loading.set(false);
      }
    });
  }

  private clearTimer(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
  }
}
