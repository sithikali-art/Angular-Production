import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-accordion',
  imports: [IconComponent],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class AccordionComponent {
   @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';

  @Input() isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
