// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// // Import auto-generated từ ts-proto
// import {
//   PlaygroundServiceClientImpl,
//   RunRequest,
//   RunUpdate,
// } from '../grpc/grpc-generated/Playground';
// import { Metadata } from 'pdfjs-dist/types/src/display/metadata';

// @Injectable({
//   providedIn: 'root',
// })
// export class PlaygroundService {
//   private client: PlaygroundServiceClientImpl;

//   constructor() {
//     // Khởi tạo gRPC-Web client
//     const rpc = new GrpcWebImpl('http://localhost:8080', {
//       transport: undefined, // có thể dùng cross-browser transport
//       debug: true,
//       metadata: new Headers({ Authorization: 'Bearer token-demo' }) as unknown as Metadata,
//     });
//     this.client = new PlaygroundServiceClientImpl(rpc);
//   }

//   runCode(requestData: {
//     language: string;
//     source_code: string;
//     stdin: string;
//     memory_mb: number;
//     cpus: number;
//     time_limit_sec: number;
//   }): Observable<RunUpdate> {
//     // Với ts-proto, request chỉ là object thường (không cần new)
//     const request: RunRequest = {
//       language: requestData.language,
//       sourceCode: requestData.source_code,
//       stdin: requestData.stdin,
//       memoryMb: requestData.memory_mb,
//       cpus: requestData.cpus,
//       timeLimitSec: requestData.time_limit_sec,
//     };

//     // Hàm Run() trả về Observable<RunUpdate>
//     return this.client.Run(request);
//   }
// }
