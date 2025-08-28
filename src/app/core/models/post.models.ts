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
  orgId: string;
  title: string;
  content: string; // markdown format
  tags: string[];
  field: string[]; // list of URLs to images, documents, videos, etc.
  metrics: Metrics;
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
  title: string;
  orgId?: string;
  content: string;
  isPublic?: boolean; // sẽ tính từ postType ở component
  allowComment?: boolean;
  postType?: PostType;
  fileUrls: string; // CHUẨN THEO BE (lưu ý đánh vần!)
  hashtag: string; // nếu muốn gửi dạng mảng
  fileDocument?: FileDocument | null;
}

export interface CreatePostRequest {
  title: string;
  orgId?: string;
  content: string;
  isPublic: boolean;
  allowComment: boolean;
  postType: PostType;
  hashtag?: string;

  fileDocument?: {
    file?: File;
    category?: string;
    description?: string;
    tags?: string[];
    isLectureVideo?: boolean;
    isTextBook?: boolean;
    orgId?: string;
  };
}

//get post response
// Thông tin user
export interface PostUser {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null; // có thể null
  active: boolean;
  roles: Set<string>; // hoặc string[] nếu API trả ra dạng array
}

// Thông tin access
export interface PostAccess {
  createdBy: string;
  createdAt: string; // Instant → dùng ISO string, khi cần thì parse thành Date
  updatedBy: string;
  updatedAt: string;
  deletedBy?: string;
  deletedAt?: string;
  postAccessId: string;
  userId: string;
  isExcluded: boolean;
  deleted: boolean;
}

// Response chính của Post
export type PostResponse = {
  postId: string;
  user: PostUser | null;
  orgId: string;
  postType: 'Global' | 'Organization' | 'Group';
  title: string;
  content: string;
  isPublic: boolean;
  allowComment: boolean;
  hashtag: string;
  imagesUrls: string[];
  accesses: PostAccess[];
  createdAt: string;
  commentCount: number;
  upvoteCount: number;
  downvoteCount: number;
};
