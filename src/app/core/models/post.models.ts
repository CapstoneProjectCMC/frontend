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
  reactions: string[];
  //ds id những đứa được truy cập bài post
  accesses: string[];
  deleted: boolean;
}
// Định nghĩa kiểu dữ liệu cho fileDocument
interface FileDocument {
  file: File | null;
  category: string[];
  description: string;
  tags: Tag[];
  isLectureVideo: boolean;
  isTextBook: boolean;
  orgId: string;
}

// Định nghĩa kiểu dữ liệu cho post
export interface PostADD {
  title: string;
  orgId: string;
  content: string;
  isPublic: boolean;
  allowComment: boolean;
  postType: string;
  oldImagesUrls: string[];
  hashtag: Tag[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // có thể thêm enum thay vì string
  fileDocument: FileDocument;
}
