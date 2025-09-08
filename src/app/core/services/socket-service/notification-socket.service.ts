// notification.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketConnectionService } from '../config-socket/socketConnection.service';
import { NOTIFICATION_SOCKET_PORT } from '../config-socket/port-socket';

export interface NotificationEvent {
  channel: string;
  recipient: string;
  templateCode: string;
  param: Record<string, any>;
  subject: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationSocketService {
  private readonly url = `${NOTIFICATION_SOCKET_PORT}?token=${localStorage.getItem(
    'token'
  )}`;

  constructor(private socketService: SocketConnectionService) {
    this.socketService.connect(this.url);
  }

  listenNotifications(): Observable<NotificationEvent> {
    return this.socketService.on<NotificationEvent>(this.url, 'notification');
  }

  listenNoticeCount(): Observable<{ unread: number }> {
    return this.socketService.on<{ unread: number }>(
      this.url,
      'notification-unread'
    );
  }
}
