import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

export type TipPlacement = 'top' | 'bottom';

@Component({
  selector: 'app-info-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './info-tooltip.component.html',
  styleUrl: './info-tooltip.component.scss',
  host: {
    class: 'd-inline-flex align-items-center',
    '(window:resize)': 'reposition()',
    '(window:orientationchange)': 'reposition()',
    '(window:scroll)': 'reposition()',
    '(document:keydown.escape)': 'hide()',
  },
})
export class InfoTooltipComponent {
  private static nextId = 0;

  // ---- Inputs -------------------------------------------------------------
  readonly text = input.required<string>();
  readonly label = input('');
  readonly placement = input<TipPlacement>('top');
  readonly maxWidth = input(265);
  readonly gap = input(10);
  readonly edgePadding = input(8);

  // ---- State --------------------------------------------------------------
  readonly id = `app-info-tooltip-${InfoTooltipComponent.nextId++}`;
  readonly visible = signal(false);
  readonly hasProjected = signal(true); // assume a custom icon → no flash of the fallback
  readonly resolvedPlacement = signal<TipPlacement>('top');
  readonly coords = signal({ top: 0, left: 0 });

  private readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
  private readonly tip = viewChild<ElementRef<HTMLElement>>('tip');
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private pinned = false;
  private raf = 0;

  constructor() {
    effect(() => {
      if (this.visible()) {
        setTimeout(() => this.reposition(), 0);
      }
    });

    afterNextRender(() => {
      const btn = this.trigger().nativeElement;

      // anything inside the button that isn't our own label/fallback = projected content
      const projected = Array.from(btn.children).some(
        (el) => !el.classList.contains('tip-icon') && !el.classList.contains('tip-label'),
      );
      this.hasProjected.set(projected);

      const ro = new ResizeObserver(() => this.reposition());
      ro.observe(this.document.documentElement);
      ro.observe(btn);

      this.destroyRef.onDestroy(() => {
        ro.disconnect();
        cancelAnimationFrame(this.raf);
      });
    });
  }

  // ---- Visibility ---------------------------------------------------------
  show(): void {
    this.visible.set(true);
  }

  hide(): void {
    if (this.pinned) return;
    this.visible.set(false);
  }

  toggle(): void {
    this.pinned = !this.pinned;
    if (this.pinned) {
      this.show();
    } else {
      this.visible.set(false);
    }
  }

  // ---- Positioning --------------------------------------------------------
  reposition(): void {
    if (!this.visible()) return;
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => this.measure());
  }

  private measure(): void {
    const win = this.document.defaultView;
    const tipEl = this.tip()?.nativeElement;
    if (!win || !tipEl) return;

    const t = this.trigger().nativeElement.getBoundingClientRect();
    const tipW = tipEl.offsetWidth;
    const tipH = tipEl.offsetHeight;
    const vw = win.innerWidth;
    const vh = win.innerHeight;
    const pad = this.edgePadding();
    const gap = this.gap();

    const roomAbove = t.top - gap - pad;
    const roomBelow = vh - t.bottom - gap - pad;
    let placement = this.placement();
    if (placement === 'top' && tipH > roomAbove && roomBelow > roomAbove) placement = 'bottom';
    if (placement === 'bottom' && tipH > roomBelow && roomAbove > roomBelow) placement = 'top';

    const top = placement === 'top' ? t.top - gap - tipH : t.bottom + gap;

    const triggerCenter = t.left + t.width / 2;
    const ideal = triggerCenter - tipW / 2;
    const left = Math.min(Math.max(ideal, pad), Math.max(pad, vw - pad - tipW));

    this.resolvedPlacement.set(placement);
    this.coords.set({ top: Math.round(top), left: Math.round(left) });
  }
}