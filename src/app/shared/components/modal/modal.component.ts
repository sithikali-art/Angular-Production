import { Component, input, output, computed, HostListener } from '@angular/core';

export type BootstrapModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  // Inputs
  isOpen = input<boolean>(false);
  title = input<string>('');
  size = input<BootstrapModalSize>('md');
  centered = input<boolean>(true);
  scrollable = input<boolean>(false);
  closeOnBackdrop = input<boolean>(true);
  showCloseButton = input<boolean>(true);

  // Outputs
  closeModal = output<void>();

  // Compute dynamic size classes
  dialogClasses = computed(() => {
    const classes = ['modal-dialog'];
    
    if (this.centered()) classes.push('modal-dialog-centered');
    if (this.scrollable()) classes.push('modal-dialog-scrollable');
    if (this.size() !== 'md') classes.push(`modal-${this.size()}`);

    return classes.join(' ');
  });

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) {
      this.closeModal.emit();
    }
  }

  onBackdropClick() {
    if (this.closeOnBackdrop()) {
      this.closeModal.emit();
    }
  }
}
