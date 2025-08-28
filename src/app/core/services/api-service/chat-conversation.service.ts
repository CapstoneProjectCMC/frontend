import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import { API_CONFIG } from '../config-service/api.enpoints';
import { Conversation, Message } from '../../models/conversation-chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private api: ApiMethod) {}

  getMyConversations(page: number, size: number) {
    return this.api.get<ApiResponse<IPaginationResponse<Conversation[]>>>(
      API_CONFIG.ENDPOINTS.GET.GET_MY_CONVERSATIONS(page, size)
    );
  }

  getMessages(page: number, size: number, conversationId: string) {
    return this.api.get<ApiResponse<IPaginationResponse<Message[]>>>(
      API_CONFIG.ENDPOINTS.GET.GET_CHAT_MESSAGES(page, size, conversationId)
    );
  }

  createConversation(participantIds: string[]) {
    return this.api.post<ApiResponse<Conversation>>(
      API_CONFIG.ENDPOINTS.POST.CREATE_CONVERSATION,
      { type: 'DIRECT', participantIds }
    );
  }

  createGroupConversation(
    groupName: string,
    topic: string | null,
    participantIds: string[],
    fileAvatarGroup: File | null
  ) {
    // Ghép participantIds thành chuỗi cách nhau bằng dấu ,
    const participantIdsStr = participantIds.join(',');

    // Chuẩn bị dữ liệu text
    const formDataData: Record<string, any> = {
      name: groupName,
      topic: topic || 'alo',
      type: 'GROUP',
      participantIds: participantIdsStr,
    };

    // Gọi API
    return this.api.postWithFormData<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.CREATE_GROUP_CONVERSATION,
      formDataData,
      fileAvatarGroup ? { fileAvatarGroup } : undefined
    );
  }

  createMessage(payload: { conversationId: string; message: string }) {
    return this.api.post<ApiResponse<Message>>(
      API_CONFIG.ENDPOINTS.POST.CREATE_CHAT_MESSAGE,
      payload
    );
  }

  markAsRead(
    conversationId: string,
    payload: { upToMessageId?: string; upToTime: string }
  ) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.MARK_AS_READ(conversationId),
      payload
    );
  }
}
