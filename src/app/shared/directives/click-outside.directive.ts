import { Directive, ElementRef, inject, output } from '@angular/core';

/**
 * Emits when the user clicks anywhere outside the host element.
 * Used by every popover/dropdown to dismiss itself.
 */
@Directive({
  selector: '[appClickOutside]',
  host: { '(document:mousedown)': 'onDocumentMouseDown($event)' },
})
export class ClickOutsideDirective {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly appClickOutside = output<void>();

  onDocumentMouseDown(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.appClickOutside.emit();
    }
  }
}
