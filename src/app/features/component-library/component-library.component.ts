import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../shared/ui/button/button.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import {
  COMPONENT_LIBRARY,
  LibraryEntry,
  componentMeta,
  displayName,
} from './component-registry';

/**
 * /component-library — living showcase of every shared component.
 * Entries come from COMPONENT_LIBRARY (component-registry.ts); selector,
 * inputs and outputs are reflected from the component definitions at
 * runtime, and each card renders the real component as a live preview.
 */
@Component({
  selector: 'app-component-library',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet, ButtonComponent, IconComponent],
  templateUrl: './component-library.component.html',
  styleUrl: './component-library.component.scss',
})
export class ComponentLibraryComponent {
  private readonly router = inject(Router);

  readonly query = signal('');

  readonly entries = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = COMPONENT_LIBRARY.map((entry) => ({
      entry,
      name: displayName(entry.id),
      selector: componentMeta(entry.component).selector,
    }));
    if (!q) {
      return list;
    }
    return list.filter(
      ({ entry, name, selector }) =>
        name.toLowerCase().includes(q) ||
        selector.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q),
    );
  });

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  open(entry: LibraryEntry): void {
    this.router.navigate(['/component-library', entry.id]);
  }
}
