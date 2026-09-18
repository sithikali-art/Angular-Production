import { Component, input, model, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

export type InputVariant = 'standard' | 'hero' | 'outlined';
export type InputTextAlign = 'left' | 'right';

@Component({
  selector: 'app-input',
  imports: [ButtonComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  /** Two-way signal model for value binding */
  readonly value = model<string>('');

  /** Input placeholder */
  readonly placeholder = input<string>('');

  /** HTML input type ('text', 'number', 'password', 'email') */
  readonly type = input<string>('text');

  /** Field label text above the input */
  readonly label = input<string>('');

  /** Suffix/Currency badge label (e.g. 'USD', 'SGD') */
  readonly suffix = input<string>('');

  /** Styling variant ('standard' soft pill, 'hero' large display, 'outlined') */
  readonly variant = input<InputVariant>('standard');

  /** Text alignment inside input */
  readonly textAlign = input<InputTextAlign>('left');

  /** Action button text (e.g., 'Apply to all') */
  readonly actionText = input<string>('');

  /** Native attributes */
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);

  /** Emits when the integrated action button is clicked */
  readonly actionClick = output<void>();

  onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.value.set(el.value);
  }
}
