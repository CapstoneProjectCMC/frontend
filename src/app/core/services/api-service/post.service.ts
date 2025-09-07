import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiMethod } from '../config-service/api.methods';
import { API_CONFIG } from '../config-service/api.enpoints';
import {
  ApiResponse,
  IPaginationResponse,
  NhatApiResponeNoData,
} from '../../models/api-response';
import {
  CreatePostRequest,
  postData,
  PostResponse,
  SavedPostResponse,
} from '../../models/post.models';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient, private api: ApiMethod) {}
  getVisiblePosts(page: number, size: number) {
    return this.api.get<ApiResponse<IPaginationResponse<PostResponse[]>>>(
      API_CONFIG.ENDPOINTS.POST.GET_VISIBLE_POSTS(page, size)
    );
  }

  getPostDetails(id: string) {
    return this.api.get<ApiResponse<PostResponse>>(
      API_CONFIG.ENDPOINTS.GET.GET_POST_DETAILS(id)
    );
  }

  //deprecated
  // addPost(data: CreatePostRequest) {
  //   const formData = new FormData();

  //   // Helper append (chỉ thêm nếu có giá trị thật sự)
  //   const safeAppend = (key: string, value: any) => {
  //     if (
  //       value !== undefined &&
  //       value !== null &&
  //       !(typeof value === 'string' && value.trim() === '')
  //     ) {
  //       formData.append(key, value);
  //     }
  //   };

  //   // basic fields
  //   safeAppend('title', data.title);
  //   safeAppend('orgId', data.orgId);
  //   safeAppend('content', data.content);
  //   safeAppend('isPublic', String(data.isPublic));
  //   safeAppend('allowComment', String(data.allowComment));
  //   safeAppend('postType', data.postType);
  //   safeAppend('hashtag', data.hashtag);

  //   // array fields
  //   safeAppend(`oldImgesUrls`, data.oldImgesUrls);

  //   // optional status
  //   safeAppend('status', data.status);

  //   // fileDocument
  //   if (data.fileDocument) {
  //     const fd = data.fileDocument;
  //     safeAppend('fileDocument.file', fd.file);
  //     safeAppend('fileDocument.category', fd.category);
  //     safeAppend('fileDocument.description', fd.description);
  //     fd.tags?.forEach((tag, i) => safeAppend(`fileDocument.tags[${i}]`, tag));
  //     if (typeof fd.isLectureVideo === 'boolean') {
  //       safeAppend('fileDocument.isLectureVideo', String(fd.isLectureVideo));
  //     }
  //     if (typeof fd.isTextBook === 'boolean') {
  //       safeAppend('fileDocument.isTextBook', String(fd.isTextBook));
  //     }
  //     safeAppend('fileDocument.orgId', fd.orgId);
  //   }

  //   // Debug log
  //   for (const [key, val] of formData.entries()) {
  //     console.log(key, val);
  //   }

  //   // Gửi form-data (KHÔNG ép Content-Type)
  //   return this.api.post<NhatApiResponeNoData>(
  //     API_CONFIG.ENDPOINTS.POST.ADD_POST,
  //     formData,
  //     true
  //   );
  // }

  //sử dụng postWithFormData
  createPost(data: CreatePostRequest) {
    const { fileDocument, ...otherData } = data;

    // Gom các field còn lại vào data (lọc undefined/null)
    const formDataData: Record<string, any> = {};
    for (const [key, value] of Object.entries(otherData)) {
      if (value !== undefined && value !== null) {
        formDataData[key] = value;
      }
    }

    // Chuẩn bị files
    const files: { [fieldName: string]: File[] } = {};
    if (fileDocument?.files) {
      files['fileDocument.files'] = fileDocument.files; // key cần khớp backend
    }

    if (fileDocument) {
      const fd: Record<string, any> = {
        'fileDocument.category': fileDocument.category,
        'fileDocument.description': fileDocument.description,
        'fileDocument.tags': fileDocument.tags,
        'fileDocument.isLectureVideo': fileDocument.isLectureVideo,
        'fileDocument.isTextBook': fileDocument.isTextBook,
        'fileDocument.orgId': fileDocument.orgId,
      };

      for (const [key, value] of Object.entries(fd)) {
        if (value !== undefined && value !== null) {
          formDataData[key] = value;
        }
      }
    }

    // Gọi API
    return this.api.postWithFormData<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.ADD_POST,
      formDataData,
      Object.keys(files).length ? files : undefined // chỉ gửi nếu có file
    );
  }

  reactionPost(postId: string, reactionType: 'downvote' | 'upvote') {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.REACTION_POST(postId),
      { reactionType }
    );
  }

  deletePost(id: string) {
    return this.api.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.DELETE.DELETE_POST(id)
    );
  }

  savePost(postId: string) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.SAVE_POST(postId),
      null
    );
  }

  unSavePost(postId: string) {
    return this.api.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.SAVE_POST(postId)
    );
  }

  getSavedPosts(page: number, size: number) {
    return this.api.get<ApiResponse<IPaginationResponse<SavedPostResponse[]>>>(
      API_CONFIG.ENDPOINTS.GET.GET_SAVED_POSTS(page, size)
    );
  }
}
