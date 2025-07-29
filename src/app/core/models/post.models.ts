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
export interface Tag {
  id: string;
  label: string;
}

export interface Metrics {
  view: number;
  up: number;
  down: number;
  commentCount: number;
}

export interface Post {
  id: string;
  userId: string;
  orgId: string;
  title: string;
  content: string; // markdown format
  tags: Tag[];
  field: string[]; // list of URLs to images, documents, videos, etc.
  metrics: Metrics;
  status: string;
}
