import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse } from '../../models/api-response';
import {
  IContextThreadResponse,
  ThreadInfoResponse,
} from '../../models/chatbot.model';
import { API_CONFIG } from '../config-service/api.enpoints';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  constructor(private api: ApiMethod) {}

  createNewThread(title: string) {
    return this.api.post<ApiResponse<ThreadInfoResponse>>(
      API_CONFIG.ENDPOINTS.POST.CREATE_NEW_THREAD_CHATBOT,
      { title }
    );
  }

  getMyThreads() {
    return this.api.get<ApiResponse<ThreadInfoResponse[]>>(
      API_CONFIG.ENDPOINTS.GET.GET_MY_THREADS
    );
  }

  getThreadById(threadId: string) {
    return this.api.get<ApiResponse<IContextThreadResponse>>(
      API_CONFIG.ENDPOINTS.GET.GET_THREAD_BY_ID(threadId)
    );
  }

  sendChat(threadId: string, message: string) {
    return this.api.post<ApiResponse<string>>(
      API_CONFIG.ENDPOINTS.POST.SEND_MESSAGE_TO_CHAT(threadId),
      {
        message,
      }
    );
  }

  sendChatWithImage(threadId: string, message: string, file: File) {
    return this.api.postWithFormData<ApiResponse<string>>(
      API_CONFIG.ENDPOINTS.POST.SEND_MESSAGE_IMG_TO_CHAT(threadId),
      { message },
      file
    );
  }

  deleteThread(threadId: string) {
    return this.api.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.DELETE.DELETE_THREAD_CHATBOT(threadId)
    );
  }

  renameThread(threadId: string, newName: string) {
    return this.api.patch<ApiResponse<ThreadInfoResponse>>(
      API_CONFIG.ENDPOINTS.PATCH.RENAME_THREAD(threadId),
      newName
    );
  }
}
