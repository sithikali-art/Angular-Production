import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

export interface StepItem {
  id: string | number;
  label: string;
  disabled?: boolean;
}

export type StepperVariant = 'pills' | 'line';

@Component({
  selector: 'app-stepper',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent {
  /** Array of steps to display */
  readonly steps = input.required<StepItem[]>();

  /** Current active step index (zero-based, two-way bindable signal) */
  readonly activeStepIndex = model<number>(0);

  /** Visual variant: 'pills' (Drawer style) or 'line' (Payment flow style) */
  readonly variant = input<StepperVariant>('pills');

  // --- Footer Configuration Inputs ---
  readonly nextLabel = input<string>('Next');
  readonly finalNextLabel = input<string>('Confirm & Submit');
  readonly backLabel = input<string>('Back');
  readonly showCancel = input<boolean>(true);
  readonly nextDisabled = input<boolean>(false);
  readonly loading = input<boolean>(false);

  // --- Footer Events ---
  readonly cancel = output<void>();
  readonly finish = output<void>();

  // Computed state helpers
  readonly isFirstStep = computed(() => this.activeStepIndex() === 0);
  readonly isLastStep = computed(() => this.activeStepIndex() === this.steps().length - 1);
  readonly currentNextLabel = computed(() =>
    this.isLastStep() ? this.finalNextLabel() : this.nextLabel()
  );

  selectStep(index: number): void {
    if (this.steps()[index]?.disabled) return;
    this.activeStepIndex.set(index);
  }

  handleBack(): void {
    if (!this.isFirstStep()) {
      this.activeStepIndex.update((idx) => idx - 1);
    }
  }

  handleNext(): void {
    if (this.isLastStep()) {
      this.finish.emit();
    } else {
      this.activeStepIndex.update((idx) => idx + 1);
    }
  }

  /** Reset stepper to the first step when close icon is clicked */
  resetToFirstStep(): void {
    this.activeStepIndex.set(0);
  }
}
