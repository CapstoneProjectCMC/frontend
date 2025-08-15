export interface resourceCardInfo {
  id: string;
  avatarAuthor: string;
  authorId: string;
  authorName: string;
  fileResource: File;
  progress: number;
  title: string;
  time: Date;
  description: string;
  tags: string[];
  status: string;
  public: boolean;
}
export interface Tag {
  id: string; // Guid
  name: string;
}

export enum FileCategory {
  Image = 0,
  Video = 1,
  RegularFile = 2,
  Other = 3,
}

export interface ResourceData {
  id: string; // Guid
  fileName: string;
  fileType: string;
  size: number; // long
  url: string;
  checksum: string;
  category: FileCategory;
  isActive: boolean;
  description: string;
  thumbnailUrl: string;
  transcodingStatus: 'success' | 'pending' | 'failed';
  associatedResourceIds: string[];
  tags: Tag[];
  isLectureVideo: boolean;
  isTextbook: boolean;
  viewCount: number;
  rating: number;
  orgId: string; // Guid
  duration: string; // TimeSpan
  hlsUrl: string;
}
