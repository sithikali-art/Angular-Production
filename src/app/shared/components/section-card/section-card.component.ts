import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-section-card',
  imports: [IconComponent],
  templateUrl: './section-card.component.html',
  styleUrl: './section-card.component.scss',
})
export class SectionCardComponent {
/** Header title text */
  title = input<string>('');

  /** Background color for card header */
  headerBg = input<string>('#ffffff');

  /** Optional right-aligned badge/subtitle text */
  badgeText = input<string>('');

  /** Name of icon to render via <app-icon> (e.g. 'calendar', 'user') */
  icon = input<string>('');

  /** Pixel size for the header icon */
  iconSize = input<number>(18);
}
