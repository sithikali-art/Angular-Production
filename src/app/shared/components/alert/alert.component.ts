import { Component, input, output, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type AlertType = 'success' | 'info' | 'warning' | 'danger';

@Component({
  selector: 'app-alert',
  imports: [IconComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  /** Alert message text */
  readonly message = input<string>('Company added');

  /** Tabler icon name for check badge */
  readonly icon = input<string>('check');

  /** Allow manual dismissal */
  readonly dismissible = input<boolean>(true);

  /** Emits event when dismissed */
  readonly dismissed = output<void>();

  /** Internal state visibility */
  readonly isVisible = signal<boolean>(true);

  dismiss(): void {
    this.isVisible.set(false);
    this.dismissed.emit();
  }
}
