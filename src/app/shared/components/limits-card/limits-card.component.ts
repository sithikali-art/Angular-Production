import { Component, input, computed, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-limits-card',
  imports: [CurrencyPipe],
  templateUrl: './limits-card.component.html',
  styleUrl: './limits-card.component.scss',
})
export class LimitsCardComponent {
  // Configurable Inputs
  title = input<string>('Daily limits');
  currentAmount = input<number>(0);
  maxAmount = input<number>(0);
  currentTransactions = input<number>(0);
  maxTransactions = input<number>(0);
  currencyCode = input<string>('USD');
  actionLabel = input<string>('View details');

  // Event Emitter for parent component handling
  actionClick = output<void>();

  // Auto-calculated progress bar percentage
  progressPercentage = computed(() => {
    const max = this.maxAmount();
    if (!max || max === 0) return 0;
    const percentage = (this.currentAmount() / max) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  });

  onActionClick(event: Event): void {
    event.preventDefault();
    this.actionClick.emit();
  }
}
