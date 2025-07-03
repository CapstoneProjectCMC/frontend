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

// Danh sách endpoint cần bỏ qua gửi thông báo lỗi
const IGNORE_ERROR_NOTIFICATION_URLS = [
  'dành cho endpoint API nào k cần gửi thông báo lỗi',
  // Thêm các endpoint khác nếu cần
];

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

      // Nếu không nằm trong danh sách bỏ qua thì gửi thông báo lỗi
      if (
        !IGNORE_ERROR_NOTIFICATION_URLS.some((url) => req.url.includes(url))
      ) {
        sendNotification(store, errorStatus, errorMessage, 'error');
      }

      // Trả về lỗi với cấu trúc: { code, message, status }
      return throwError(() => ({
        code: errorCode,
        message: errorMessage,
        status: errorStatus,
      }));
    })
  );
};
