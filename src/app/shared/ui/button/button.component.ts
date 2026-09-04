import { Component, Input } from '@angular/core'; 
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button',
  imports: [IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() btnText:string=""
  @Input() btnVariant:'success'|'primary'|'warning'='primary';
  @Input() icon = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
}
