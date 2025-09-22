import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketConnectionService {
  private sockets = new Map<string, Socket>();

  /** urlOrPath: ví dụ "/ws/chat" (prod) hoặc "http://localhost:4099" (dev) */
  connect(urlOrPath: string): Socket {
    if (!this.sockets.has(urlOrPath)) {
      // Phân tích URL để tách base (http/https) và path /socket.io
      const u = new URL(urlOrPath, window.location.origin);
      const isTls = u.protocol === 'https:' || u.protocol === 'wss:';
      const base = `${isTls ? 'https' : 'http'}://${u.host}`;
      const path =
        (u.pathname.endsWith('/') ? u.pathname.slice(0, -1) : u.pathname) +
        '/socket.io';

      const token = localStorage.getItem('token') || undefined;

      const socket = io(base, {
        path,
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        withCredentials: true,
        query: token ? { token } : undefined, // thêm query
      });

      socket.on('connect', () => console.log(`Đã kết nối WS: ${base}${path}`));
      socket.on('connect_error', (err) =>
        console.error(`Kết nối WS thất bại (${base}${path}):`, err.message)
      );

      this.sockets.set(urlOrPath, socket);
    }
    return this.sockets.get(urlOrPath)!;
  }

  emit(url: string, event: string, data?: any) {
    this.sockets.get(url)?.emit(event, data);
  }

  on<T>(url: string, event: string): Observable<T> {
    return new Observable<T>((observer) => {
      this.sockets.get(url)?.on(event, (data: T) => observer.next(data));
    });
  }

  disconnect(url: string) {
    const s = this.sockets.get(url);
    s?.disconnect();
    this.sockets.delete(url);
  }
}
