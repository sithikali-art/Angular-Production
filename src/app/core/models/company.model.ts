/** One row of the "Company status" popover. */
export interface CompanyStatusItem {
  key: string;
  label: string;
  /** Tabler icon name. */
  icon: string;
  value: string;
  /** ok → check mark; action → "Not Approved →" style chip. */
  state: 'ok' | 'action';
}

/** Matches C# model: Xtrm.Api.Models.CompanyProfile */
export interface CompanyProfile {
  id: string;
  name: string;
  spn: string;
  identityLevel: { label: string; level: number; verified: boolean };
  /** Overall status shown in the popover header (e.g. "Pending"). */
  statusLabel: string;
  statusItems: CompanyStatusItem[];
  capabilities: CompanyCapability[];
}

export interface CompanyCapability {
  key: string;
  label: string;
  detail: string;
  enabled: boolean;
  /** Tabler icon name shown in the status dropdown. */
  icon: string;
}

/** One row of the global search dropdown (companies & individuals). */
export interface SearchDirectoryEntry {
  id: string;
  name: string;
  detail: string;
  type: 'Company' | 'Individual';
}
