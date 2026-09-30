import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { AccountStateService, AvatarStyleId } from '../../../core/state/account-state.service';
import { IconComponent } from '../icon/icon.component';

/**
 * The signed-in user's avatar (generated style or uploaded photo) from
 * AccountStateService, at any size; optionally shows an edit (pencil)
 * badge that emits when clicked. Used in the header profile chip and on
 * the Account page.
 */
@Component({
  selector: 'app-profile-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './profile-avatar.component.html',
  styleUrl: './profile-avatar.component.scss',
})
export class ProfileAvatarComponent {
  readonly account = inject(AccountStateService);

  readonly size = input(36);
  /** Show the pencil badge and emit (edit) when it is clicked. */
  readonly editable = input(false);
  /** Render a specific style instead of the saved avatar (dialog previews). */
  readonly previewStyle = input<AvatarStyleId | null>(null);

  readonly edit = output<void>();
}
