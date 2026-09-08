import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-badge',
  imports: [IconComponent],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
   @Input() badgeText = '';

  @Input() badgeVariant:
    | 'success'
    | 'primary'
    | 'warning'
    | 'danger'
    | 'secondary' = 'primary';

  @Input() badgeType: 'icon-text' | 'text' | 'number' = 'text';

  @Input() icon = '';
}
