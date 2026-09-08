import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const HUES = [244, 258, 226, 270, 210, 288];

/** Gradient initials avatar (deterministic hue from the name). */
@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  readonly name = input.required<string>();
  readonly size = input(36);

  readonly initials = computed(() =>
    this.name()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join(''),
  );

  readonly gradient = computed(() => {
    const hash = [...this.name()].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const hue = HUES[hash % HUES.length];
    return `linear-gradient(135deg, hsl(${hue} 84% 66%), hsl(${hue + 24} 74% 54%))`;
  });
}
