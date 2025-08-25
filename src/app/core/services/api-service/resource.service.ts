import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiMethod } from '../config-service/api.methods';
import {
  ApiResponse,
  XuanIPaginationResponse,
  XuanPresignedUrlResponse,
} from '../../models/api-response';
import { ResourceData, Tag } from '../../models/resource.model';
import { API_CONFIG } from '../config-service/api.enpoints';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  constructor(private http: HttpClient, private api: ApiMethod) {}
  getResource(PageSize: number, PageIndex: number) {
    return this.api.post<ApiResponse<XuanIPaginationResponse<ResourceData[]>>>(
      API_CONFIG.ENDPOINTS.POST.GET_FILE,
      {
        PageIndex,
        PageSize,
      }
    );
  }
  getVideoResources() {
    return this.api.get<ApiResponse<XuanIPaginationResponse<ResourceData[]>>>(
      API_CONFIG.ENDPOINTS.GET.GET_FILE_VIDEOS
    );
  }
  getResourceById(id: string) {
    return this.api.get<ApiResponse<XuanIPaginationResponse<ResourceData>>>(
      API_CONFIG.ENDPOINTS.GET.GET_FILE_BY_ID(id)
    );
  }
  addResource(postData: {
    file: File;
    category: number;
    description: string;
    tags: string[];
    isLectureVideo: boolean;
    isTextbook: boolean;
    orgId?: string;
    associatedResourceIds?: string[];
    thumbnailUrl?: string;
  }) {
    const formData = new FormData();

    if (postData.file) {
      formData.append('file', postData.file);
    }

    if (postData.category !== null) {
      formData.append('category', postData.category.toString());
    }

    formData.append('description', postData.description || '');
    formData.append('isLectureVideo', String(postData.isLectureVideo));
    formData.append('isTextbook', String(postData.isTextbook));

    if (postData.orgId) {
      formData.append('orgId', postData.orgId);
    }

    if (postData.thumbnailUrl) {
      formData.append('thumbnailUrl', postData.thumbnailUrl);
    }

    // Tags array
    postData.tags?.forEach((tag, i) => formData.append(`tags[${i}]`, tag));

    // Associated resources array
    postData.associatedResourceIds?.forEach((id, i) =>
      formData.append(`associatedResourceIds[${i}]`, id)
    );

    return this.api.post<ApiResponse<XuanPresignedUrlResponse>>(
      API_CONFIG.ENDPOINTS.POST.ADD_FILE,
      formData,
      true
    );
  }

  editResource(
    id: string,
    fileName: string,
    isActive: boolean,
    file: File,
    category: number,
    description: string,
    tags: Tag[],
    isLectureVideo: boolean,
    isTextbook: boolean,
    orgId: string
  ) {
    return this.api.put<ApiResponse<XuanIPaginationResponse<ResourceData>>>(
      API_CONFIG.ENDPOINTS.PUT.EDIT_FILE(id),
      {
        id,
        fileName,
        isActive,
        file,
        category,
        description,
        tags,
        isLectureVideo,
        isTextbook,
        orgId,
      }
    );
  }
  deleteResourceById(
    id: string,
    fileName: string,
    isActive: boolean,
    file: File,
    category: number,
    description: string,
    tags: Tag[],
    isLectureVideo: boolean,
    isTextbook: boolean,
    orgId: string
  ) {
    return this.api.deletehasbody<ApiResponse<XuanPresignedUrlResponse>>(
      API_CONFIG.ENDPOINTS.DELETE.DELETE_FILE(id),
      {
        id,
        fileName,
        isActive,
        file,
        category,
        description,
        tags,
        isLectureVideo,
        isTextbook,
        orgId,
      }
    );
  }
}
