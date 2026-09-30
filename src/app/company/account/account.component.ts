import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MOCK_COMPANY } from '../../core/mock/mock-data';
import {
  AccountStateService,
  AvatarChoice,
  AvatarStyleId,
} from '../../core/state/account-state.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DropdownComponent, DropdownOption } from '../../shared/components/dropdown/dropdown.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { LimitsCardComponent } from '../../shared/components/limits-card/limits-card.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ProfileAvatarComponent } from '../../shared/components/profile-avatar/profile-avatar.component';
import { ToggleSwitchComponent } from '../../shared/components/toggle-switch/toggle-switch.component';
import { InfoTooltipComponent } from '../../shared/components/info-tooltip/info-tooltip.component';
// import { DynamicCalloutComponent } from '../../shared/components/dynamic-callout/dynamic-callout.component';

type AccountSection = 'account' | 'company' | 'security' | 'limits' | 'activity';

interface AccountMenuItem {
  id: AccountSection;
  label: string;
  description: string;
  icon: string;
}

/**
 * /account — the signed-in user's account hub, opened from the header
 * profile chip: profile card with avatar editing (Customize avatar
 * dialog), a section menu (vertical on desktop, horizontally scrollable
 * tabs on small screens with the active tab auto-scrolled into view),
 * and per-section panels including view/edit modes for My Account.
 */
@Component({
  selector: 'app-account',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ButtonComponent,
    DropdownComponent,
    IconComponent,
    InputComponent,
    LimitsCardComponent,
    ModalComponent,
    PageHeaderComponent,
    ProfileAvatarComponent,
    ToggleSwitchComponent,
    InfoTooltipComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  readonly account = inject(AccountStateService);
  readonly company = MOCK_COMPANY;

  readonly menu: AccountMenuItem[] = [
    { id: 'account', label: 'My Account', description: 'Edit your profile and account information.', icon: 'user' },
    { id: 'company', label: 'Company Profile', description: 'Manage company and organization details.', icon: 'building' },
    { id: 'security', label: 'Security and Privacy', description: 'Manage password, 2FA, and privacy settings.', icon: 'shield' },
    { id: 'limits', label: 'Limits', description: 'Manage your transfer limits, card limits, and related controls.', icon: 'gauge' },
    { id: 'activity', label: 'Activity Log', description: 'Review account activity, history, and recent actions.', icon: 'history' },
  ];

  readonly section = signal<AccountSection>('account');

  readonly countryOptions: DropdownOption[] = [
    { label: 'United States of America', value: 'United States of America' },
    { label: 'United Kingdom', value: 'United Kingdom' },
    { label: 'India', value: 'India' },
    { label: 'Singapore', value: 'Singapore' },
    { label: 'Canada', value: 'Canada' },
  ];

  readonly timezoneOptions: DropdownOption[] = [
    { label: 'America/New_York', value: 'America/New_York' },
    { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
    { label: 'Europe/London', value: 'Europe/London' },
    { label: 'Asia/Kolkata', value: 'Asia/Kolkata' },
    { label: 'Asia/Singapore', value: 'Asia/Singapore' },
  ];

  readonly activityLog = [
    { icon: 'login', text: 'Signed in from Chrome on Windows', when: 'Today, 9:42 AM' },
    { icon: 'pencil', text: 'Updated company profile details', when: 'Yesterday, 4:18 PM' },
    { icon: 'shield-check', text: 'Two-factor authentication verified', when: 'Sep 22, 11:03 AM' },
    { icon: 'credit-card', text: 'Funding bank account ending 3097 selected', when: 'Sep 19, 2:47 PM' },
  ];

  /* --- My Account view/edit --- */
  readonly editing = signal(false);
  editFullName = '';
  editCountry: string | number | null = '';
  editTimezone: string | number | null = '';
  editJobPosition = '';
  editSsn = '';

  startEdit(): void {
    const profile = this.account.profile();
    this.editFullName = profile.fullName;
    this.editCountry = profile.country;
    this.editTimezone = profile.timezone;
    this.editJobPosition = profile.jobPosition;
    this.editSsn = profile.ssnMasked;
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
  }

  saveEdit(): void {
    const fullName = this.editFullName.trim();
    if (!fullName) {
      return;
    }
    this.account.updateProfile({
      fullName,
      country: String(this.editCountry ?? ''),
      timezone: String(this.editTimezone ?? ''),
      jobPosition: this.editJobPosition.trim(),
      ssnMasked: this.editSsn.trim(),
    });
    this.editing.set(false);
  }

  /* --- Section menu (auto-scroll the active tab into view) --- */
  selectSection(id: AccountSection, element: EventTarget | null): void {
    this.section.set(id);
    this.editing.set(false);
    // On small screens the menu is a horizontal scroller — keep the
    // selected tab visible whether it sits to the left or the right.
    // block: 'nearest' makes this a no-op vertically on desktop.
    (element as HTMLElement | null)?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }

  /* --- Customize avatar dialog --- */
  readonly avatarStyles: AvatarStyleId[] = ['smiley', 'sphere', 'horizon', 'split', 'ring', 'pixels'];
  readonly avatarOpen = signal(false);
  readonly pendingAvatar = signal<AvatarChoice | null>(null);
  readonly pendingPhotoUrl = computed(() => {
    const pending = this.pendingAvatar();
    return pending?.kind === 'photo' ? pending.dataUrl : null;
  });
  readonly uploadError = signal('');

  openAvatar(): void {
    this.pendingAvatar.set(this.account.avatar());
    this.uploadError.set('');
    this.avatarOpen.set(true);
  }

  closeAvatar(): void {
    this.avatarOpen.set(false);
  }

  pickStyle(style: AvatarStyleId): void {
    this.pendingAvatar.set({ kind: 'style', style });
    this.uploadError.set('');
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      this.uploadError.set('Only PNG, JPG or WEBP images are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.uploadError.set('The image must be 5MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.pendingAvatar.set({ kind: 'photo', dataUrl: String(reader.result) });
      this.uploadError.set('');
    };
    reader.readAsDataURL(file);
  }

  saveAvatar(): void {
    const pending = this.pendingAvatar();
    if (pending) {
      this.account.setAvatar(pending);
    }
    this.avatarOpen.set(false);
  }

  isPendingStyle(style: AvatarStyleId): boolean {
    const pending = this.pendingAvatar();
    return pending?.kind === 'style' && pending.style === style;
  }
}
