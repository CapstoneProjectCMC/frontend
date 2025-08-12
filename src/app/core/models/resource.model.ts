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
