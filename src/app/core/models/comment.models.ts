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
