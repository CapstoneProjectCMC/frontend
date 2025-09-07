export interface ICommentFilmResponse {
  id: string;
  parentId: string | null;
  content: string;
  isDeactivated: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    email?: string;
    role?: string;
    avatarUrl: string;
    backgroundUrl?: string;
  };
  replies?: ICommentFilmResponse[];
}

export interface User {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  active: boolean;
  roles: string[]; // hoặc string[] nếu API trả về mảng
}

export interface CommentResponse {
  commentId: string;
  parentCommentId: string | null; // vì có thể null khi là comment gốc
  content: string;
  replies?: CommentResponse[] | []; // đệ quy
  user: User;
  createdAt: string;
}

export interface AddCommentResponse {
  commentId: string;
  parentCommentId: string;
  content: string;
}
