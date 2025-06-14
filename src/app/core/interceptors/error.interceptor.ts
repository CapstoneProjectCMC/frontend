import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { sendNotification } from '../../shared/utils/notification';

// Bản đồ lỗi từ mã lỗi API sang thông báo tiếng Việt
const ERROR_MESSAGES: Record<number, string> = {
  50006: 'Lỗi đánh dấu đã đọc!',
  50007: 'Lỗi đếm thông báo đã đọc!',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Mặc định lấy HTTP status code và status text
      let errorCode = error.status;
      let errorMessage = 'Không thể kết nối tới máy chủ!';
      const errorStatus = `${error.status} ${error.statusText}`;

      // Nếu lỗi có response body là object, lấy code và message từ đó
      if (error.error && typeof error.error === 'object') {
        console.log(error.error);
        errorCode = error.error.code || error.status;
        errorMessage =
          ERROR_MESSAGES[errorCode] || error.error.message || errorMessage;
      }

      // Gửi thông báo lỗi với NgRx Store
      //   const notification: INotification = {
      //     id: Date.now().toString(),
      //     title: 'Lỗi',
      //     message: errorMessage,
      //     type: 'error',
      //     timestamp: new Date(),
      //   };
      //   store.dispatch(addNotification({ notification }));

      sendNotification(store, 'Lỗi', errorMessage, 'error');

      // Trả về lỗi với cấu trúc: { code, message, status }
      return throwError(() => ({
        code: errorCode,
        message: errorMessage,
        status: errorStatus,
      }));
    })
  );
};
