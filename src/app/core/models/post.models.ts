export interface PostCardInfo {
  id: string;
  avatar: string;
  author: string;
  title: string;
  time: string;
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
  tags: string[];
  field: string[]; // list of URLs to images, documents, videos, etc.
  metrics: Metrics;
  status: string;
}
export interface postData {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  deletedBy: string;
  deletedAt: string;
  //đống bên trên có lẽ sẽ bỏ đi
  // thiếu lượng vote
  postId: string;
  userId: string;
  orgId: string;
  postType: 'Global' | 'Private' | 'Org';
  title: string;
  content: string;
  isPublic: boolean;
  allowComment: boolean;
  hashtag: string[];
  status: 'REJECTED' | 'APPROVED' | 'PENDING';
  imagesUrls: string[];
  //mai nhật gửi
  comments: {
    userId: string;
    userAvatar: string;
    comment: string;
  }[];
  //nhật chưa làm
  reactions: { upvote: number; downvote: number };
  //ds id những đứa được truy cập bài post
  accesses: string[];
  deleted: boolean;
}
export type PostType = 'Global' | 'Private' | 'Org';
export type PostStatus = 'REJECTED' | 'APPROVED' | 'PENDING';
export interface FileDocument {
  file?: File;
  category?: string; // BE mong muốn STRING
  description?: string;
  tags?: string[]; // mảng -> sẽ append tags[0], tags[1]...
  isLectureVideo?: boolean;
  isTextBook?: boolean;
  orgId?: string;
}

export interface PostADD {
  postId?: string; // BE có field này -> optional
  title: string;
  orgId: string;
  content: string;
  isPublic: boolean; // sẽ tính từ postType ở component
  allowComment: boolean;
  postType: PostType;
  oldImgesUrls: string; // CHUẨN THEO BE (lưu ý đánh vần!)
  hashtag: string; // nếu muốn gửi dạng mảng
  status: PostStatus;
  fileDocument?: FileDocument;
}
