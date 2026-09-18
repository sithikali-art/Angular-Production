import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

const FLAGS: Record<string, string> = {
  US: '🇺🇸',
  IN: '🇮🇳',
  GB: '🇬🇧',
  MY: '🇲🇾',
  DE: '🇩🇪',
  EU: '🇪🇺',
};

/**
 * Circular country-flag image (20×20 by default, object-fit: cover).
 * Falls back to the emoji flag when the image cannot load (offline).
 */
@Component({
  selector: 'app-flag-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './flag-icon.component.html',
  styleUrl: './flag-icon.component.scss',
  host: { '[style.--flag-size.px]': 'size()' },
})
export class FlagIconComponent {
  readonly countryCode = input.required<string>();
  readonly size = input(20);

  readonly imageFailed = signal(false);

  readonly flagUrl = computed(
    () => `https://flagcdn.com/w40/${this.countryCode().toLowerCase()}.png`,
  );
  readonly emoji = computed(() => FLAGS[this.countryCode().toUpperCase()] ?? '🏳️');
}
