import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { DrawerComponent } from '../../../shared/ui/drawer/drawer.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import {
  COMPONENT_LIBRARY,
  componentMeta,
  displayName,
} from '../component-registry';

/**
 * /component-library/:id — detail view for one shared component:
 * large live preview (interactive open/close demo for overlay components),
 * reflected selector + inputs/outputs, and a copyable usage example.
 */
@Component({
  selector: 'app-component-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgComponentOutlet,
    RouterLink,
    ButtonComponent,
    DrawerComponent,
    IconComponent,
    ModalComponent,
  ],
  templateUrl: './component-detail.component.html',
  styleUrl: './component-detail.component.scss',
})
export class ComponentDetailComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly entry = computed(() => COMPONENT_LIBRARY.find((e) => e.id === this.id()) ?? null);
  readonly name = computed(() => displayName(this.id()));
  readonly meta = computed(() => {
    const entry = this.entry();
    return entry ? componentMeta(entry.component) : { selector: '', inputs: [], outputs: [] };
  });

  /** Open state for the drawer/modal interactive demos. */
  readonly demoOpen = signal(false);
  readonly copied = signal(false);

  copyExample(): void {
    const entry = this.entry();
    if (!entry) {
      return;
    }
    navigator.clipboard?.writeText(entry.example).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1600);
    });
  }
}
