import { Injectable, signal } from '@angular/core';

/** Generated avatar style ids shown in the "Customize avatar" dialog. */
export type AvatarStyleId = 'smiley' | 'sphere' | 'horizon' | 'split' | 'ring' | 'pixels';

/** The user's avatar: a generated style, or an uploaded photo (data URL). */
export type AvatarChoice =
  | { kind: 'style'; style: AvatarStyleId }
  | { kind: 'photo'; dataUrl: string };

/** Matches C# model: Xtrm.Api.Models.AccountProfile */
export interface AccountProfile {
  fullName: string;
  email: string;
  country: string;
  timezone: string;
  role: string;
  jobPosition: string;
  ssnMasked: string;
}

/**
 * Session state for the signed-in user's account: profile fields shown
 * and edited on the /account page, and the chosen avatar (generated
 * style or uploaded photo) rendered by app-profile-avatar everywhere.
 */
@Injectable({ providedIn: 'root' })
export class AccountStateService {
  readonly profile = signal<AccountProfile>({
    fullName: 'Jegan Raghavan',
    email: 'jegan@acme.com',
    country: 'United States of America',
    timezone: 'America/New_York',
    role: 'Master Admin',
    jobPosition: 'Assistant Manager at ACME',
    ssnMasked: 'XXXXX-6789',
  });

  readonly avatar = signal<AvatarChoice>({ kind: 'style', style: 'smiley' });

  updateProfile(changes: Partial<AccountProfile>): void {
    this.profile.update((current) => ({ ...current, ...changes }));
  }

  setAvatar(choice: AvatarChoice): void {
    this.avatar.set(choice);
  }
}
