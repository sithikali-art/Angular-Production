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
    const element = this.host.nativeElement as HTMLElement;
    // A hidden host (e.g. the sidebar's mobile-only copy of a popover
    // anchor while on desktop) must not dismiss the visible copy —
    // otherwise clicks inside the visible popover close it on mousedown
    // before the button's click handler can run.
    if (!element.offsetParent) {
      return;
    }
    if (!element.contains(event.target as Node)) {
      this.appClickOutside.emit();
    }
  }
}
