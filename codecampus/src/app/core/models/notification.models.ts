export interface INotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
}

export type NotificationType = 'success' | 'warning' | 'error' | 'info';
