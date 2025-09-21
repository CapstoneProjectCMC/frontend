import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { CODE_COMPILER_SOCKET } from '../config-socket/port-socket';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(CODE_COMPILER_SOCKET, {
      transports: ['websocket'],
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
