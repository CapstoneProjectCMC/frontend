export interface NotificationEvent {
  channel: string;
  recipient: string;
  templateCode: string;
  param: Record<string, any>;
  subject: string;
  body: string;
}
