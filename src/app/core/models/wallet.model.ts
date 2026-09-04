/** Currency codes supported by the platform (C# enum: CurrencyCode). */
export type CurrencyCode = 'USD' | 'INR' | 'GBP' | 'MYR' | 'EUR';

/** Funding bank summary shown in the Wallet Details drawer. */
export interface WalletFundBank {
  bankName: string;
  accountNo: string;
  swift: string;
  wireAba: string;
  beneficiary: string;
}

/** Matches C# model: Xtrm.Api.Models.Wallet */
export interface Wallet {
  id: string;
  walletId: number;
  name: string;
  currency: CurrencyCode;
  /** ISO 3166-1 alpha-2 code used for the flag chip. */
  countryCode: string;
  balance: number;
  isDefault: boolean;
  status: 'Active' | 'Locked' | 'Closed';
  createdUtc: string;
  entity: string;
  walletType: string;
  fundBank: WalletFundBank;
}

/** Matches C# model: Xtrm.Api.Models.WalletTransaction */
export interface WalletTransaction {
  id: string;
  walletId: number;
  counterparty: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  runningBalance: number;
  direction: 'Credit' | 'Debit';
  occurredUtc: string;
  /** Optional avatar/badge image shown in activity lists. */
  avatarUrl?: string;
}

/** Matches C# model: Xtrm.Api.Models.FundingBankAccount */
export interface FundingBankAccount {
  id: string;
  currency: CurrencyCode;
  accountType: 'Checking' | 'Savings' | 'Operating';
  /** Last 4 digits only — full number never leaves the API. */
  maskedNumber: string;
  accountNumberDisplay: string;
  routingNumber: string;
  bankName: string;
}

export type FundingMethod = 'ACH' | 'Wire' | 'Debit Card';

/** One month of aggregated credits/debits for the activity chart. */
export interface MonthlyActivityPoint {
  month: string;
  credits: number;
  debits: number;
}

/** Matches C# model: Xtrm.Api.Models.WalletActivitySummary */
export interface WalletActivitySummary {
  walletId: number;
  walletName: string;
  currency: CurrencyCode;
  balance: number;
  totalCredits: number;
  totalDebits: number;
  series: MonthlyActivityPoint[];
}
