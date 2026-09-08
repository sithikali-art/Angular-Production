import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { IconComponent } from '../../shared/ui/icon/icon.component';

/**
 * Shared stub page for routes whose flows aren't part of this demo
 * (Move, Transfer, Exchange, …). Renders the route's `data.title`
 * so every sidebar destination still resolves and highlights.
 */
@Component({
  selector: 'app-placeholder-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './placeholder-page.component.html',
  styleUrl: './placeholder-page.component.scss',
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(this.route.data, { initialValue: {} as Record<string, string> });

  readonly title = computed(() => this.data()['title'] ?? 'Coming soon');
  readonly icon = computed(() => this.data()['icon'] ?? 'sparkles');
}
