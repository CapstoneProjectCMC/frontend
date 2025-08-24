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
    return this.api.get<ApiResponse<IPaginationResponse<postData[]>>>(
      API_CONFIG.ENDPOINTS.POST.GET_POST
    );
  }
  addPost(data: {
    title: string;
    orgId?: string;
    content: string;
    isPublic: boolean;
    allowComment: boolean;
    postType: 'Global' | 'Private' | 'Org';
    oldImgesUrls?: string;
    hashtag?: string;
    status?: 'REJECTED' | 'APPROVED' | 'PENDING';
    fileDocument?: {
      file?: File;
      category?: string;
      description?: string;
      tags?: string[];
      isLectureVideo?: boolean;
      isTextBook?: boolean;
      orgId?: string;
    };
  }) {
    const formData = new FormData();

    // Helper append (chỉ thêm nếu có giá trị thật sự)
    const safeAppend = (key: string, value: any) => {
      if (
        value !== undefined &&
        value !== null &&
        !(typeof value === 'string' && value.trim() === '')
      ) {
        formData.append(key, value);
      }
    };

    // basic fields
    safeAppend('title', data.title);
    safeAppend('orgId', data.orgId);
    safeAppend('content', data.content);
    safeAppend('isPublic', String(data.isPublic));
    safeAppend('allowComment', String(data.allowComment));
    safeAppend('postType', data.postType);
    safeAppend('hashtag', data.hashtag);

    // array fields
    safeAppend(`oldImgesUrls`, data.oldImgesUrls);

    // optional status
    safeAppend('status', data.status);

    // fileDocument
    if (data.fileDocument) {
      const fd = data.fileDocument;
      safeAppend('fileDocument.file', fd.file);
      safeAppend('fileDocument.category', fd.category);
      safeAppend('fileDocument.description', fd.description);
      fd.tags?.forEach((tag, i) => safeAppend(`fileDocument.tags[${i}]`, tag));
      if (typeof fd.isLectureVideo === 'boolean') {
        safeAppend('fileDocument.isLectureVideo', String(fd.isLectureVideo));
      }
      if (typeof fd.isTextBook === 'boolean') {
        safeAppend('fileDocument.isTextBook', String(fd.isTextBook));
      }
      safeAppend('fileDocument.orgId', fd.orgId);
    }

    // Debug log
    for (const [key, val] of formData.entries()) {
      console.log(key, val);
    }

    // Gửi form-data (KHÔNG ép Content-Type)
    return this.api.post<NhatApiResponeNoData>(
      API_CONFIG.ENDPOINTS.POST.ADD_POST,
      formData,
      true
    );
  }

  deletePost(id: string) {
    return this.api.put<NhatApiResponeNoData>(
      API_CONFIG.ENDPOINTS.PUT.DELETE_POST(id),
      {}
    );
  }
}
