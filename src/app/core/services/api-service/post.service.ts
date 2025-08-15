import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiMethod } from '../config-service/api.methods';
import { API_CONFIG } from '../config-service/api.enpoints';
import {
  ApiResponse,
  IPaginationResponse,
  NhatApiResponeNoData,
} from '../../models/api-response';
import { postData } from '../../models/post.models';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient, private api: ApiMethod) {}
  getPosts(PageSize: number, PageIndex: number) {
    return this.api.post<ApiResponse<IPaginationResponse<postData[]>>>(
      API_CONFIG.ENDPOINTS.POST.GET_POST,
      {
        PageIndex,
        PageSize,
      }
    );
  }

  addPost(data: {
    title: string;
    orgId: string;
    content: string;
    isPublic: boolean;
    allowComment: boolean;
    postType: 'Global' | 'Private' | 'Org';
    oldImagesUrls?: string[];
    hashtag?: string[];
    status: 'REJECTED' | 'APPROVED' | 'PENDING';
    fileDocument?: {
      file?: File;
      category?: string[];
      description?: string;
      tags?: string[];
      isLectureVideo?: boolean;
      isTextBook?: boolean;
      orgId?: string;
    };
  }) {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('orgId', data.orgId);
    formData.append('content', data.content);
    formData.append('isPublic', String(data.isPublic));
    formData.append('allowComment', String(data.allowComment));
    formData.append('postType', data.postType);

    data.oldImagesUrls?.forEach((url, i) => {
      formData.append(`oldImgesUrls[${i}]`, url);
    });

    data.hashtag?.forEach((has, i) => {
      formData.append(`hashtag[${i}]`, has);
    });

    formData.append('status', data.status);

    if (data.fileDocument) {
      if (data.fileDocument.file) {
        formData.append('fileDocument.file', data.fileDocument.file);
      }
      data.fileDocument.category?.forEach((cat, i) => {
        formData.append(`fileDocument.category[${i}]`, cat);
      });
      if (data.fileDocument.description) {
        formData.append(
          'fileDocument.description',
          data.fileDocument.description
        );
      }
      data.fileDocument.tags?.forEach((tag, i) => {
        formData.append(`fileDocument.tags[${i}]`, tag);
      });
      if (typeof data.fileDocument.isLectureVideo === 'boolean') {
        formData.append(
          'fileDocument.isLectureVideo',
          String(data.fileDocument.isLectureVideo)
        );
      }
      if (typeof data.fileDocument.isTextBook === 'boolean') {
        formData.append(
          'fileDocument.isTextBook',
          String(data.fileDocument.isTextBook)
        );
      }
      if (data.fileDocument.orgId) {
        formData.append('fileDocument.orgId', data.fileDocument.orgId);
      }
    }

    return this.api.post<NhatApiResponeNoData>(
      API_CONFIG.ENDPOINTS.POST.ADD_POST,
      formData
    );
  }

  deletePost(id: string) {
    return this.api.put<NhatApiResponeNoData>(
      API_CONFIG.ENDPOINTS.PUT.DELETE_POST(id),
      {}
    );
  }
}
