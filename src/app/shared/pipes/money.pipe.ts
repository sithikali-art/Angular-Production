import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyCode } from '../../core/models';

const LOCALES: Partial<Record<CurrencyCode, string>> = {
  INR: 'en-IN',
};

/**
 * Formats amounts the way the mockups do: "6,435.34", optionally with
 * a currency symbol ("$6,435.34") or signed suffix style ("+1,245.50").
 */
@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    currency: CurrencyCode = 'USD',
    style: 'plain' | 'symbol' | 'signed' = 'plain',
  ): string {
    if (value === null || value === undefined) {
      return '—';
    }
    const locale = LOCALES[currency] ?? 'en-US';
    const abs = Math.abs(value).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    switch (style) {
      case 'symbol': {
        const symbol = (0)
          .toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })
          .replace(/[\d\s.,]/g, '');
        return `${value < 0 ? '−' : ''}${symbol}${abs}`;
      }
      case 'signed':
        return `${value < 0 ? '−' : '+'}${abs}`;
      default:
        return `${value < 0 ? '−' : ''}${abs}`;
    }
  }
}
