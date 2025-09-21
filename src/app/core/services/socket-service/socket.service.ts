import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CODE_COMPILER_SOCKET } from '../config-socket/port-socket';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    const u = new URL(CODE_COMPILER_SOCKET, window.location.origin);
    const isTls = u.protocol === 'https:' || u.protocol === 'wss:';
    const base = `${isTls ? 'https' : 'http'}://${u.host}`;
    const path =
      (u.pathname.endsWith('/') ? u.pathname.slice(0, -1) : u.pathname) +
      '/socket.io';

    this.socket = io(base, {
      path,
      transports: ['websocket'],
      withCredentials: true,
    });
  }

  emit(event: string, data?: any) {
    this.socket.emit(event, data);
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>((observer) => {
      this.socket.on(event, (data: T) => observer.next(data));
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
