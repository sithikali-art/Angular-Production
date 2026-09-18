/** Matches C# model: Xtrm.Api.Models.CompanyEntity */
export interface CompanyEntity {
  entityId: string;
  name: string;
  /** Headquarters / Subsidiary / Regional Office */
  entityType: string;
  /** True for the primary ("PRIME") corporate entity. */
  prime: boolean;
  location: string;
  businessFunction: string;
  assignedUsers: number;
  status: 'Active' | 'Inactive';
  entityAdmin: { name: string; email: string };
  createdOn: string;
  lastUpdated: string;
  notes: string;
}

/** Matches C# model: Xtrm.Api.Models.OrganizationUser */
export interface OrganizationUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  entityName: string;
  status: 'Active' | 'Invited' | 'Inactive';
}
