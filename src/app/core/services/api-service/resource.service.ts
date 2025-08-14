import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { googleScriptCheckPaid } from '../../../../environments/environment.secret';
import { ApiMethod } from '../config-service/api.methods';
import { ITransactionStatus } from '../../models/service-and-payment';
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
      API_CONFIG.ENDPOINTS.POST.GET_RESOURCE,
      {
        PageIndex,
        PageSize,
      }
    );
  }
  getResourceById(id: string) {
    return this.api.get<ApiResponse<XuanIPaginationResponse<ResourceData>>>(
      API_CONFIG.ENDPOINTS.GET.GET_RESOURCE_BY_ID(id)
    );
  }
  addResource(
    file: File,
    category: number,
    description: string,
    tags: Tag[],
    isLectureVideo: boolean,
    isTextbook: boolean,
    orgId: string
  ) {
    return this.api.post<ApiResponse<XuanPresignedUrlResponse>>(
      API_CONFIG.ENDPOINTS.POST.ADD_RESOURCE,
      { file, category, description, tags, isLectureVideo, isTextbook, orgId }
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
      API_CONFIG.ENDPOINTS.PUT.EDIT_RESOURCE(id),
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
      API_CONFIG.ENDPOINTS.DELETE.DELETE_RESOURCE(id),
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
