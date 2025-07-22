export interface PostCardInfo {
  id: string;
  avatar: string;
  author: string;
  title: string;
  time: Date;
  description: string;
  tags: string[];
  comment: number;
  upvote: number;
  downvote: number;
  status: string;
  public: boolean;
}
