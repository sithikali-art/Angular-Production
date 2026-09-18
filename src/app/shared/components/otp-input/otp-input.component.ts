import { Component, ElementRef, QueryList, ViewChildren, input, output, signal, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-otp-input',
  imports: [],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.scss',
})
export class OtpInputComponent implements AfterViewInit {
  /** Total number of OTP digits required. */
  length = input<number>(6);

  /** Event emissions */
  completed = output<string>();
  codeChange = output<string>();
  resend = output<void>();
  back = output<void>();

  @ViewChildren('otpInput') inputElements!: QueryList<ElementRef<HTMLInputElement>>;

  otpValues = signal<string[]>(Array(6).fill(''));

  get slots(): number[] {
    return Array.from({ length: this.length() }, (_, i) => i);
  }

  ngAfterViewInit(): void {
    // Focus the first input box immediately on load/refresh/redirect
    setTimeout(() => {
      this.inputElements.first?.nativeElement.focus();
    }, 0);
  }

  onInput(event: Event, index: number): void {
    const inputEl = event.target as HTMLInputElement;
    const digit = inputEl.value.replace(/\D/g, '').slice(-1);
    
    const updated = [...this.otpValues()];
    updated[index] = digit;
    this.otpValues.set(updated);
    inputEl.value = digit;

    const code = updated.join('');
    this.codeChange.emit(code);

    if (digit && index < this.length() - 1) {
      this.inputElements.toArray()[index + 1]?.nativeElement.focus();
    }

    if (code.length === this.length() && !updated.includes('')) {
      this.completed.emit(code);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpValues()[index] && index > 0) {
      this.inputElements.toArray()[index - 1]?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, this.length()) || '';
    if (!pasted) return;

    const updated = Array(this.length()).fill('');
    pasted.split('').forEach((char, i) => (updated[i] = char));
    this.otpValues.set(updated);

    const code = updated.join('');
    this.codeChange.emit(code);

    const focusIdx = Math.min(pasted.length, this.length() - 1);
    this.inputElements.toArray()[focusIdx]?.nativeElement.focus();

    if (code.length === this.length()) {
      this.completed.emit(code);
    }
  }
}
