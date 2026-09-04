import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Global footer: feedback line, link columns and legal strip. */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly footerCols = [
    { title: 'Company', links: ['About Xtrm', 'Security', 'Careers', 'Contact Us'] },
    { title: 'Products', links: ['Wallets', 'Pay', 'Mass Pay', 'API Payments', 'Currency Exchange'] },
    { title: 'Resources', links: ['Help Center', 'Fees', 'Service Status', 'Developer Docs', 'Privacy Policy'] },
    { title: 'Legal', links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Compliance'] },
  ];
}
