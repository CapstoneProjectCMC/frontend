import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiMethod } from '../config-service/api.methods';
import {
  ApiResponse,
  XuanIPaginationResponse,
  XuanPresignedUrlResponse,
} from '../../models/api-response';
import {
  MediaResource,
  ResourceCreateRequest,
  ResourceData,
  Tag,
} from '../../models/resource.model';
import { API_CONFIG } from '../config-service/api.enpoints';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  constructor(private http: HttpClient, private api: ApiMethod) {}

  //lỗi thời
  getAllResource(pageSize: number, pageIndex: number) {
    return this.api.post<ApiResponse<XuanIPaginationResponse<ResourceData[]>>>(
      API_CONFIG.ENDPOINTS.POST.GET_ALL_FILE_RESOURCE,
      {
        pageIndex,
        pageSize,
      }
    );
  }

  //bản cập nhật
  getAllResourceLearning(pageSize: number, pageIndex: number) {
    return this.api.post<ApiResponse<XuanIPaginationResponse<MediaResource[]>>>(
      API_CONFIG.ENDPOINTS.POST.GET_ALL_FILE_RESOURCE,
      {
        pageIndex,
        pageSize,
      }
    );
  }

  getVideoResources() {
    return this.api.get<ApiResponse<MediaResource[]>>(
      API_CONFIG.ENDPOINTS.GET.GET_FILE_VIDEOS
    );
  }
  getDocumentResources() {
    return this.api.get<ApiResponse<MediaResource[]>>(
      API_CONFIG.ENDPOINTS.GET.GET_FILE_DOCUMENTS
    );
  }
  getResourceById(id: string) {
    return this.api.get<ApiResponse<MediaResource>>(
      API_CONFIG.ENDPOINTS.GET.GET_FILE_BY_ID(id)
    );
  }

  addResource(postData: ResourceCreateRequest) {
    const { file, category, isLectureVideo, isTextbook, description, tags } =
      postData;

    // data: phần dữ liệu thông thường (không phải file)
    const data: Record<string, any> = {
      category,
      description,
      isLectureVideo,
      isTextbook,
      tags: JSON.stringify(tags), // stringify array để backend parse
    };

    // files: phần file
    const files: File = file;

    return this.api.postWithFormData<ApiResponse<XuanPresignedUrlResponse>>(
      API_CONFIG.ENDPOINTS.POST.ADD_FILE,
      data,
      files
    );
  }

  editResource(
    id: string,
    fileName?: string,
    isActive?: boolean,
    file?: File,
    category?: number,
    description?: string,
    tags?: string[],
    isLectureVideo?: boolean,
    isTextbook?: boolean,
    // orgId?: string,
    thumbnailUrl?: string
  ) {
    const formData = new FormData();

    formData.append('id', id);

    if (fileName !== undefined) {
      formData.append('fileName', fileName);
    }

    if (isActive !== undefined) {
      formData.append('isActive', String(isActive));
    }

    if (file !== undefined) {
      formData.append('file', file);
    }

    if (category !== undefined) {
      formData.append('category', String(category));
    }

    if (description !== undefined) {
      formData.append('description', description);
    }

    if (tags !== undefined) {
      tags.forEach((tag, i) => formData.append(`tags[${i}]`, tag));
    }

    if (isLectureVideo !== undefined) {
      formData.append('isLectureVideo', String(isLectureVideo));
    }

    if (isTextbook !== undefined) {
      formData.append('isTextbook', String(isTextbook));
    }

    // if (orgId !== undefined) {
    //   formData.append('orgId', orgId);
    // }
    if (thumbnailUrl !== undefined) {
      formData.append('thumbnailUrl', thumbnailUrl);
    }

    return this.api.put<ApiResponse<XuanIPaginationResponse<ResourceData>>>(
      API_CONFIG.ENDPOINTS.PUT.EDIT_FILE(id),
      formData,
      true
    );
  }

  deleteResourceById(id: string) {
    return this.api.deletehasbody<ApiResponse<string>>(
      API_CONFIG.ENDPOINTS.DELETE.DELETE_FILE(id)
    );
  }
}
