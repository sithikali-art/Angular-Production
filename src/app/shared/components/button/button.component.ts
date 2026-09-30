import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type ButtonVariant = 'primary' | 'soft' | 'ghost' | 'outline' | 'success' | 'warning' | 'cancel' | 'dropdown';

@Component({
  selector: 'app-button',
  imports: [IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly btnText = input<string>('');
  readonly btnVariant = input<ButtonVariant>('primary');
  readonly icon = input<string>('');
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly btnType = input<'button' | 'submit'>('button');
  readonly disabled = input<boolean>(false);
  readonly btnClass = input<string>('');
}
