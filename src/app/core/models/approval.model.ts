import { CurrencyCode } from './wallet.model';

export type ApprovalType = 'Mass Pay' | 'Bank Transfer' | 'Wallet' | 'Advanced Pay';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Declined';

export interface ApprovalApprover {
  name: string;
  status: 'Approved' | 'Waiting';
}

export interface ApprovalTimelineEntry {
  label: string;
  occurredUtc: string;
}

/** Matches C# model: Xtrm.Api.Models.ApprovalItem */
export interface ApprovalItem {
  id: string;
  type: ApprovalType;
  title: string;
  description: string;
  status: ApprovalStatus;
  amount: number | null;
  currency: CurrencyCode | null;
  requester: string;
  entity: string;
  requestedUtc: string;
  submissionId: string;
  policy: string;
  requiredApprovals: string;
  recipients: number | null;
  fundingWallet: string | null;
  notes: string;
  approvers: ApprovalApprover[];
  timeline: ApprovalTimelineEntry[];
  /** True when the signed-in user is one of the pending approvers. */
  assignedToMe: boolean;
}
