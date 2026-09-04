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

const PALETTE_KEY = 'xtrm-palette';
const MODE_KEY = 'xtrm-mode';

/**
 * Palette + light/dark mode state. An effect() projects the signals onto
 * <html data-palette class="dark"> so plain CSS custom properties do the
 * actual theming — changes apply instantly, everywhere.
 */
@Injectable({ providedIn: 'root' })
export class ThemeStateService {
  private readonly document = inject(DOCUMENT);

  readonly palettes = PALETTES;
  readonly palette = signal<PaletteId>(this.restore(PALETTE_KEY, 'aurora') as PaletteId);
  readonly mode = signal<ThemeMode>(this.restore(MODE_KEY, 'light') as ThemeMode);

  constructor() {
    effect(() => {
      const root = this.document.documentElement;
      root.dataset['palette'] = this.palette();
      root.classList.toggle('dark', this.mode() === 'dark');
      this.persist(PALETTE_KEY, this.palette());
      this.persist(MODE_KEY, this.mode());
    });
  }

  setPalette(id: PaletteId): void {
    this.palette.set(id);
    // PM View is a dark-first palette — switching to it implies dark mode.
    if (id === 'newage') {
      this.mode.set('dark');
    }
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  private restore(key: string, fallback: string): string {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }

  private persist(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable — theme just won't persist */
    }
  }
}
