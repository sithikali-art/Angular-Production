import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/** /profile — User Profile page opened from the topbar profile chip. */
@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, IconComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly user = {
    name: 'Jegan Raghavan',
    email: 'jegan@acme.com',
    role: 'Administrator',
    company: 'Acme Inc.',
    phone: '+1 (415) 555-0117',
    timezone: 'America/Los_Angeles (PST)',
    memberSince: 'February 2024',
    twoFactor: true,
  };

  readonly details = [
    { icon: 'user', label: 'Full name', value: this.user.name },
    { icon: 'mail', label: 'Email', value: this.user.email },
    { icon: 'building', label: 'Company', value: this.user.company },
    { icon: 'shield-check', label: 'Role', value: this.user.role },
    { icon: 'history', label: 'Member since', value: this.user.memberSince },
    { icon: 'world', label: 'Timezone', value: this.user.timezone },
  ];
}
