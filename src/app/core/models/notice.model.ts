export type ReadStatusNotice = 'ALL' | 'READ' | 'UNREAD';

export type DeliveryStatus = 'PENDING' | 'SENT' | 'FAILED';

export type GetAllNoticeResponse = {
  id: string;
  recipient: string;
  channel: ReadStatusNotice; // "SOCKET" | "EMAIL" | "ALL"...
  templateCode: string;
  subject: string;
  body: string;
  param: { class: string; exercise: string };
  readStatus: string;
  readAt: null;
  deliveryStatus: DeliveryStatus; //// PENDING | SENT | FAILED
  deliveredAt: string;
  createdAt: string;
};
