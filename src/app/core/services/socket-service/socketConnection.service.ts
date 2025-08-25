import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketConnectionService {
  private sockets: Map<string, Socket> = new Map();

  connect(url: string): Socket {
    if (!this.sockets.has(url)) {
      const socket = io(url, { transports: ['websocket'] });
      this.sockets.set(url, socket);
    }
    return this.sockets.get(url)!;
  }

  emit(url: string, event: string, data?: any) {
    const socket = this.sockets.get(url);
    socket?.emit(event, data);
  }

  on<T>(url: string, event: string): Observable<T> {
    return new Observable<T>((observer) => {
      const socket = this.sockets.get(url);
      socket?.on(event, (data: T) => observer.next(data));
    });
  }

  disconnect(url: string) {
    const socket = this.sockets.get(url);
    socket?.disconnect();
    this.sockets.delete(url);
  }
}
