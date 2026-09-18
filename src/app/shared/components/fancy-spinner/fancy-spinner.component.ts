import { Component, input } from '@angular/core';

@Component({
  selector: 'app-fancy-spinner',
  imports: [],
  templateUrl: './fancy-spinner.component.html',
  styleUrl: './fancy-spinner.component.scss',
})
export class FancySpinnerComponent {
    // Using modern Angular Signal inputs for reusability
  
  /** CSS color value (hex, rgb, etc.) to override the default primary color */
  color = input<string>('#6366F1'); 
  
  /** Width and height of the spinner */
  size = input<string>('72px'); 
  
  /** Accessibility label for screen readers */
  // ariaLabel = input<string>('Loading');
}
