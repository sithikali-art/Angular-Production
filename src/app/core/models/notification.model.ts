export type AlertKind = 'plan' | 'approval' | 'gift' | 'access' | 'security';

/** Matches C# model: Xtrm.Api.Models.AlertNotification */
export interface AlertNotification {
  id: string;
  kind: AlertKind;
  title: string;
  message: string;
  createdUtc: string;
  isRead: boolean;
}
