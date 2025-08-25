import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// Giả lập các kiểu dữ liệu để code rõ ràng hơn
export interface Conversation {
  id: string;
  conversationName: string;
  conversationAvatar: string;
  lastMessage: string;
  modifiedDate: string;
  unread: number;
}

export interface Message {
  id: string;
  conversationId: string;
  message: string;
  createdDate: string;
  me: boolean; // Thuộc tính này cần được xác định từ backend hoặc frontend
  sender?: { avatar: string };
  failed?: boolean;
  pending?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly API_URL = 'http://your-api-url'; // Thay bằng URL API của bạn

  constructor(private http: HttpClient) {}

  getMyConversations(): Observable<any> {
    // Thay thế bằng lời gọi API thật
    // return this.http.get<any>(`${this.API_URL}/conversations`);
    console.log('Fetching conversations...');
    return of({ data: { result: [] } }); // Trả về mảng rỗng để không lỗi lúc đầu
  }

  getMessages(conversationId: string): Observable<any> {
    // return this.http.get<any>(`${this.API_URL}/conversations/${conversationId}/messages`);
    return of({ data: { result: [] } });
  }

  createConversation(participantIds: string[]): Observable<any> {
    // return this.http.post<any>(`${this.API_URL}/conversations`, { type: 'DIRECT', participantIds });
    return of({});
  }

  createMessage(payload: {
    conversationId: string;
    message: string;
  }): Observable<any> {
    // return this.http.post<any>(`${this.API_URL}/messages`, payload);
    return of({});
  }
}
