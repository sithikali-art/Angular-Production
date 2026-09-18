import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-textarea',
  imports: [],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent {
  /** Two-way bindable value signal */
  readonly value = model<string>('');

  /** Dynamic label input (not hardcoded) */
  readonly label = input<string>();

  /** Field placeholder text */
  readonly placeholder = input<string>('Optional');

  /** Visible text lines */
  readonly rows = input<number>(3);

  /** Disabled state */
  readonly disabled = input<boolean>(false);

  /** Validation error message */
  // readonly errorMessage = input<string>();

  /** HTML ID for accessibility */
  readonly elementId = input<string>(`textarea-${Math.random().toString(36).substring(2, 9)}`);

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
  }
}
