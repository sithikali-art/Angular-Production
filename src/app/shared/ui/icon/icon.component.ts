import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Tabler Icons (webfont) wrapper. Renders `<i class="ti ti-...">` so
 * every icon in the app is a genuine Tabler icon and inherits
 * `currentColor`. Legacy internal names are mapped to Tabler classes.
 */
const TABLER_NAME: Record<string, string> = {
  wallet: 'credit-card',
  'arrow-back': 'arrow-back-up',
  chart: 'chart-histogram',
  bank: 'building-bank',
  menu: 'menu-2',
  'credit-up': 'arrow-up-right',
  'credit-down': 'arrow-down-right',
  'wallet-draft':'wallet'
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input(16);
  /** Kept for API compatibility; the webfont has a fixed stroke. */
  readonly strokeWidth = input(2);

  readonly tablerClass = computed(() => `ti ti-${TABLER_NAME[this.name()] ?? this.name()}`);
}
