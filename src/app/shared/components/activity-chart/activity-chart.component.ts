import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CurrencyCode } from '../../../core/models';
import { ChartKind, ChartRange, WalletStateService } from '../../../core/state/wallet-state.service';
import { MoneyPipe } from '../../pipes/money.pipe';
import { IconComponent } from '../../ui/icon/icon.component';

interface BarPair {
  month: string;
  creditX: number;
  creditY: number;
  creditH: number;
  debitX: number;
  debitY: number;
  debitH: number;
  labelX: number;
}

const W = 780;
const H = 250;
const PAD_LEFT = 52;
const PAD_BOTTOM = 26;
const PAD_TOP = 10;
const BAR_W = 13;
const BAR_GAP = 6;
const MAX_Y = 2400;
const TICKS = [0, 600, 1200, 1800, 2400];

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  USD: '$',
  INR: '₹',
  GBP: '£',
  MYR: 'RM',
  EUR: '€',
};

/**
 * Credits vs debits chart, drawn with plain SVG — no chart library.
 * Bar and line modes share the same scale; the toggle chips drive
 * `chartKind` / `chartRange` signals in the wallet store.
 */
@Component({
  selector: 'app-activity-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe, IconComponent, TitleCasePipe],
  templateUrl: './activity-chart.component.html',
  styleUrl: './activity-chart.component.scss',
})
export class ActivityChartComponent {
  readonly wallet = inject(WalletStateService);

  readonly w = W;
  readonly h = H;
  readonly padLeft = PAD_LEFT;
  readonly barW = BAR_W;
  readonly ticks = TICKS;
  readonly kinds: ChartKind[] = ['line', 'bar'];
  readonly ranges: ChartRange[] = ['year', 'month', 'day'];

  /** Index of the hovered month (drives the credits/debits tooltip). */
  readonly hoveredIndex = signal<number | null>(null);

  readonly currency = computed<CurrencyCode>(
    () => this.wallet.activitySummary()?.currency ?? 'USD',
  );
  readonly symbol = computed(() => CURRENCY_SYMBOL[this.currency()]);

  readonly hovered = computed(() => {
    const index = this.hoveredIndex();
    const series = this.wallet.activitySummary()?.series ?? [];
    if (index === null || !series[index]) {
      return null;
    }
    const centerX = this.groupCenter(index, series.length);
    const rawPct = (centerX / W) * 100;
    
    return {
      point: series[index],
      /** Tooltip position as a percentage of the chart width. */
      leftPct: Math.max(10, Math.min(90, rawPct)),
    };
  });

  /** Full-height invisible hover strips, one per month. */
  readonly hoverBands = computed(() => {
    const series = this.wallet.activitySummary()?.series ?? [];
    const bandWidth = (W - PAD_LEFT - 12) / Math.max(series.length, 1);
    return series.map((_, i) => ({
      index: i,
      x: PAD_LEFT + bandWidth * i,
      width: bandWidth,
    }));
  });

  private groupCenter(index: number, total: number): number {
    const plotWidth = W - PAD_LEFT - 12;
    return PAD_LEFT + (plotWidth / total) * (index + 0.5);
  }

  yFor(value: number): number {
    const plotHeight = H - PAD_TOP - PAD_BOTTOM;
    return PAD_TOP + plotHeight * (1 - value / MAX_Y);
  }

  readonly bars = computed<BarPair[]>(() => {
    const series = this.wallet.activitySummary()?.series ?? [];
    return series.map((point, i) => {
      const center = this.groupCenter(i, series.length);
      const creditY = this.yFor(point.credits);
      const debitY = this.yFor(point.debits);
      const baseline = this.yFor(0);
      return {
        month: point.month,
        creditX: center - BAR_W - BAR_GAP / 2,
        creditY,
        creditH: baseline - creditY,
        debitX: center + BAR_GAP / 2,
        debitY,
        debitH: baseline - debitY,
        labelX: center,
      };
    });
  });

  /** Catmull-Rom spline through the points, emitted as cubic beziers. */
  private smoothPath(points: Array<[number, number]>): string {
    if (points.length < 2) {
      return '';
    }
    const d: string[] = [`M ${points[0][0]},${points[0][1]}`];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] ?? p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d.push(`C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`);
    }
    return d.join(' ');
  }

  private linePoints(key: 'credits' | 'debits'): Array<[number, number]> {
    const series = this.wallet.activitySummary()?.series ?? [];
    return series.map((p, i) => [this.groupCenter(i, series.length), this.yFor(p[key])]);
  }

  readonly creditPath = computed(() => this.smoothPath(this.linePoints('credits')));
  readonly debitPath = computed(() => this.smoothPath(this.linePoints('debits')));

  barPath(x: number, y: number, w: number, h: number, r = 3): string {
  if (h <= 0) return '';
  const radius = Math.min(r, w / 2, h);
  return `M ${x},${y + radius} A ${radius},${radius} 0 0 1 ${x + radius},${y} H ${x + w - radius} A ${radius},${radius} 0 0 1 ${x + w},${y + radius} V ${y + h} H ${x} Z`;
}
}
