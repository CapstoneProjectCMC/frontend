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

  searchPosts(page: number, size: number, search?: string | null) {
    return this.api.get<ApiResponse<IPaginationResponse<PostResponse[]>>>(
      API_CONFIG.ENDPOINTS.GET.SEARCH_POST(page, size, search),
      true
    );
  }

  getPostDetails(id: string) {
    return this.api.get<ApiResponse<PostResponse>>(
      API_CONFIG.ENDPOINTS.GET.GET_POST_DETAILS(id)
    );
  }

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
        // 'fileDocument.tags': fileDocument.tags, // Xử lý riêng bên dưới

        'fileDocument.isLectureVideo': fileDocument.isLectureVideo,
        'fileDocument.isTextBook': fileDocument.isTextBook,
        'fileDocument.orgId': fileDocument.orgId,
      };

      for (const [key, value] of Object.entries(fd)) {
        if (value !== undefined && value !== null) {
          formDataData[key] = value;
        }
      }
      // Nếu cần gửi tags theo dạng array [0], [1]...
      if (fileDocument.tags?.length) {
        fileDocument.tags.forEach((tag, i) => {
          formDataData[`fileDocument.tags[${i}]`] = tag;
        });
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
