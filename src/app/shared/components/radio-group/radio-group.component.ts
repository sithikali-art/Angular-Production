import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface RadioOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}
@Component({
  selector: 'app-radio-group',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
})
export class RadioGroupComponent<T = any> {
  /** List of option items */
  readonly options = input.required<RadioOption[]>();

  /** Two-way bindable signal for the selected option value */
  readonly value = model<any>();

  /** Dynamic field name for accessibility */
  readonly groupName = input<string>(`radio-group-${Math.random().toString(36).substring(2, 9)}`);

  selectOption(val: any): void {
    this.value.set(val);
  }
}