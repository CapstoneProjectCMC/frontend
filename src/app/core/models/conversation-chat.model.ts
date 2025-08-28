export type Conversation = {
  id: string;
  type: 'DIRECT' | 'GROUP';
  participantsHash: string;
  conversationAvatar: string;
  conversationName: string;
  topic: string;
  ownerId: string;
  adminIds: string[];
  participants: Participant[];
  createdDate: string; // Instant
  modifiedDate: string; // Instant
  unreadCount: number; // Long
  myRole: 'OWNER' | 'ADMIN' | 'MEMBER';
  mutedUntil: string | null; // null là không bị mute
};

export type Participant = {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  backgroundUrl: string;
  active: boolean;
  firstName: string;
  lastName: string;
  gender: boolean;
};

export type Sender = {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  backgroundUrl: string;
  active: boolean;
  firstName: string;
  lastName: string;
  gender: boolean;
};

export type ConversationEvent = {
  type: 'message_created';
  at: string;
  conversation: {
    id: string;
    type: 'DIRECT' | 'GROUP' | string;
    participantsHash: string;
    conversationAvatar: string | null;
    conversationName: string | null;
    topic: string | null;
    ownerId: string | null;
    adminIds: string[] | null;
    participants: Participant[];
    createdDate: string;
    modifiedDate: string;
    unreadCount: number | null;
    myRole: string | null;
    mutedUntil: string | null;
  };
  message: Message;
};

export type Message = {
  id: string;
  conversationId: string;
  me: boolean;
  message: string;
  sender: Participant;
  createdDate: string;
  read: boolean;
  readBy?: Participant[];
};

///socket cho người dùng nhận tin nhắn
export type MessageReadEvent = {
  type: 'message_read';
  at: string; // ISO datetime
  actor: Participant;
  conversation: Conversation;
  data: {
    reader: Participant;
    lastReadAt: string; // ISO datetime
    lastReadMessageId: string | null;
  };
};
