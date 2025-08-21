import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse } from '../../models/api-response';
import { ThreadInfoResponse } from '../../models/chatbot.model';
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
}
