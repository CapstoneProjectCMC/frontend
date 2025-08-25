export type Conversation = {
  id: string;
  type: 'DIRECT' | string; // có thể là enum sau này
  participantsHash: string;
  conversationAvatar: string | null;
  conversationName: string;
  participants: Participant[];
  createdDate: string; // Instant (ISO datetime)
  modifiedDate: string; // Instant (ISO datetime)
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

export type Message = {
  id: string;
  conversationId: string;
  me: boolean;
  message: string;
  sender: Sender;
  createdDate: string; // Instant (ISO datetime string)
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
