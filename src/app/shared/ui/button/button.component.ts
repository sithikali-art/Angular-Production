import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button',
  imports: [IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() btnText:string=""
  @Input() btnVariant:'success'|'primary'|'warning'|'soft'|'ghost'|'cancel'='primary';
  @Input() icon = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  /** Native button type — 'submit' inside forms, 'button' otherwise. */
  @Input() btnType: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  /** Extra classes appended to the inner button (e.g. 'rounded-pill'). */
  @Input() btnClass = '';
}
