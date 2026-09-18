import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

export interface DropdownOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'app-dropdown',
  imports: [IconComponent, ButtonComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  /** Two-way signal model for selection binding */
  readonly value = model<string | number | null>(null);

  /** Configurable array of options */
  readonly options = input.required<DropdownOption[]>();

  /** Field placeholder text */
  readonly placeholder = input<string>('Select...');

  /** Optional label text above control */
  readonly label = input<string>('');

  /** Emits selected option object on change */
  readonly selectionChange = output<DropdownOption>();

  /** Local open state */
  readonly isOpen = signal<boolean>(false);

  private readonly elementRef = inject(ElementRef);

  /** Computed label of selected option */
  readonly selectedLabel = computed(() => {
    const selected = this.options().find((opt) => opt.value === this.value());
    return selected ? selected.label : this.placeholder();
  });

  toggleDropdown(): void {
    this.isOpen.update((prev) => !prev);
  }

  selectOption(option: DropdownOption, event: Event): void {
    event.stopPropagation();
    if (option.disabled) return;

    this.value.set(option.value);
    this.selectionChange.emit(option);
    this.isOpen.set(false);
  }

  /** Close menu on click outside container */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  /** Close on Escape key press */
  @HostListener('keydown.escape')
  onEscape(): void {
    this.isOpen.set(false);
  }
}
