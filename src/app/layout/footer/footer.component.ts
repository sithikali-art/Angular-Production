import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IconComponent } from '../../shared/components/icon/icon.component';

/** Global footer: feedback link and legal strip (no link columns). */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly legalLinks = [
    { label: 'Privacy Policy', external: false },
    { label: 'Terms of Service', external: false },
    { label: 'Help Center', external: false },
    { label: 'System Status', external: true },
  ];
}
