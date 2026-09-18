import { Component, input, model, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-search-input',
  imports: [IconComponent, ButtonComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  /** Two-way signal model for seamless parent binding */
  readonly value = model<string>('');

  /** Customization Inputs */
  readonly placeholder = input<string>('Search...');
  readonly chipPrefix = input<string>('Search');
  readonly showChip = input<boolean>(true);
  readonly iconName = input<string>('search');
  readonly clearIcon = input<string>('x');

  /** Event output when search query is cleared */
  readonly cleared = output<void>();

  onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.value.set(inputEl.value);
  }

  clearSearch(): void {
    this.value.set('');
    this.cleared.emit();
  }
}
