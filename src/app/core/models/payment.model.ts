import { CurrencyCode } from './wallet.model';

export type DraftPaymentType =
  | 'Simple Pay'
  | 'Advanced Pay'
  | 'Mass Pay'
  | 'Bill Pay'
  | 'Transfer'
  | 'Exchange'
  | 'Fund Wallet';

/** Matches C# model: Xtrm.Api.Models.DraftPayment */
export interface DraftPayment {
  id: string;
  type: DraftPaymentType;
  title: string;
  subtitle: string;
  createdBy: string;
  /** True when the draft belongs to the signed-in user. */
  isMine: boolean;
  entity: string;
  fundingWallet: string | null;
  amount: number | null;
  currency: CurrencyCode | null;
  savedUtc: string;
  /** Progress fields shown in the expanded "View details" panel. */
  recipients: string;
  amountLabel: string;
  currentStep: string;
}
