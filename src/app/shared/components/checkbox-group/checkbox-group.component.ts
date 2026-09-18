import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface CheckboxOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

@Component({
  selector: 'app-checkbox-group',
  imports: [],
  templateUrl: './checkbox-group.component.html',
  styleUrl: './checkbox-group.component.scss',
})
export class CheckboxGroupComponent {
  /** List of option items */
  readonly options = input.required<CheckboxOption[]>();

  /** Two-way bindable signal array of selected values */
  readonly value = model<any[]>([]);

  isSelected(val: any): boolean {
    return (this.value() ?? []).includes(val);
  }

  toggleOption(val: any): void {
    const current = this.value() ?? [];
    if (current.includes(val)) {
      this.value.set(current.filter((item) => item !== val));
    } else {
      this.value.set([...current, val]);
    }
  }
}
