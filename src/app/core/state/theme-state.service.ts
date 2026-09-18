import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';
export type PaletteId = 'aurora' | 'newage' | 'lux' | 'harvest' | 'basic';

export interface PaletteOption {
  id: PaletteId;
  label: string;
  swatchLabels: [string, string];
  /** Gradient stops for the preview tile in the appearance popover. */
  preview: [string, string, string];
}

export const PALETTES: PaletteOption[] = [
  { id: 'aurora', label: 'Xtrm Aurora', swatchLabels: ['COOL VIOLET', 'ELECTRIC INDIGO'], preview: ['#6366F1', '#8B5CF6', '#A78BFA'] },
  { id: 'newage', label: 'Xtrm PM View', swatchLabels: ['NEON YELLOW', 'OFF BLACK'], preview: ['#CEFE46', '#202020', '#121212'] },
  { id: 'lux', label: 'Xtrm Modern Apple', swatchLabels: ['DARK WINE', 'LINEN'], preview: ['#6F1D1B', '#F0E5DE', '#ADBDA8'] },
  { id: 'harvest', label: 'Xtrm Harvest', swatchLabels: ['CARROT ORANGE', 'HUNTER GREEN'], preview: ['#C4501B', '#E9972D', '#2B5B3F'] },
  { id: 'basic', label: 'Xtrm Basic Plain', swatchLabels: ['OFF WHITE', 'WARM CHARCOAL'], preview: ['#FAFAFA', '#252422', '#B8B3AE'] },
];

/**
 * Palette + light/dark mode state. An effect() projects the signals onto
 * <html data-palette class="dark"> so plain CSS custom properties do the
 * actual theming — changes apply instantly, everywhere.
 *
 * The app ALWAYS starts in the default appearance (Aurora, light) —
 * palette/mode choices apply for the session only and are not persisted,
 * so a reload never comes up in an unexpected theme.
 */
@Injectable({ providedIn: 'root' })
export class ThemeStateService {
  private readonly document = inject(DOCUMENT);

  readonly palettes = PALETTES;
  readonly palette = signal<PaletteId>('aurora');
  readonly mode = signal<ThemeMode>('light');

  constructor() {
    effect(() => {
      const root = this.document.documentElement;
      root.dataset['palette'] = this.palette();
      root.classList.toggle('dark', this.mode() === 'dark');
    });
  }

  setPalette(id: PaletteId): void {
    const leavingDarkFirst = this.palette() === 'newage' && id !== 'newage';
    this.palette.set(id);
    // PM View is a dark-first palette — switching to it implies dark mode,
    // and leaving it returns to light so other palettes show their true
    // (light) colors unless the user explicitly picks Dark again.
    if (id === 'newage') {
      this.mode.set('dark');
    } else if (leavingDarkFirst) {
      this.mode.set('light');
    }
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

}
