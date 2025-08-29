import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import {
  AddCommentResponse,
  CommentResponse,
} from '../../models/comment.models';
import { API_CONFIG } from '../config-service/api.enpoints';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private api: ApiMethod) {}

  getCommentByPostId(
    postId: string,
    page: number,
    size: number,
    replyLevel: number
  ) {
    return this.api.get<ApiResponse<IPaginationResponse<CommentResponse[]>>>(
      API_CONFIG.ENDPOINTS.GET.GET_COMMENT_BY_POST_ID(
        postId,
        page,
        size,
        replyLevel
      )
    );
  }

  addComment(postId: string, content: string) {
    return this.api.post<ApiResponse<AddCommentResponse>>(
      API_CONFIG.ENDPOINTS.POST.ADD_COMMENT_POST(postId),
      { content }
    );
  }

  addReply(postId: string, commentId: string, content: string) {
    return this.api.post<ApiResponse<AddCommentResponse>>(
      API_CONFIG.ENDPOINTS.POST.ADD_REPLY_COMMENT_POST(postId, commentId),
      {
        content,
      }
    );
  }

  deleteComment(commentId: string) {
    return this.api.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.DELETE.DELETE_COMMENT_POST(commentId)
    );
  }
}
