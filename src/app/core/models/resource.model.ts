import { UserBasicInfo } from './exercise.model';

export interface resourceCardInfo {
  id: string;
  avatarAuthor: string;
  thumnailurl: string;
  authorId: string;
  authorName: string;
  progress: number;
  title: string;
  time: Date;
  duration: string;
  description: string;
  tags: Tag[];
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
  createdAt: string;
}
//--------------Input episode local---------------------
export interface IEpisodeLocal {
  episodeId: string;
  watchedDuration: number;
  watchedDate: string;
}

export interface ILocalData {
  localData: IEpisodeLocal[];
}

//--------------------updated structure type---------------
export type MediaResource = {
  id: string;
  fileName: string;
  fileType: string;
  size: number;
  url: string;
  checksum: string;
  category: number;
  isActive: boolean;
  description: string;
  thumbnailUrl: string;
  transcodingStatus: string;
  associatedResourceIds: string[];
  tags: {
    id: string;
    name: string;
  }[];
  isLectureVideo: boolean;
  isTextbook: boolean;
  viewCount: number | null;
  rating: number | null;
  orgId: string | null;
  duration: number | null;
  hlsUrl: string | null;
  createdAt: string; // ISO date
  createdBy: string;
  organizationId: string | null;
  organizationRole: string;
  userProfile: UserBasicInfo;
};
