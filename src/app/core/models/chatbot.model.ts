export type ThreadInfoResponse = {
  id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
};

export interface IContextThreadResponse extends ThreadInfoResponse {
  messages: MessageInfo[] | null;
}

export type MessageInfo = {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  imageOriginalName: string | null;
  imageContentType: string | null;
  imageUrl: string | null;
  createdAt: Date;
};
