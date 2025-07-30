import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { sendNotification } from '../../shared/utils/notification';
import { Router } from '@angular/router';
import { openNoticeModal } from '../../shared/store/modal-notice-state/modal-notice.actions';
import { AuthService } from '../services/api-service/auth.service';

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
  const router = inject(Router);
  const authService = inject(AuthService);
  const refreshToken = localStorage.getItem('refreshToken');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Mặc định lấy HTTP status code và status text
      let errorCode = error.status;
      let errorMessage = 'Không thể kết nối tới máy chủ!';
      const errorStatus = `${error.status}`;

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
        if (errorCode === 4018801 && refreshToken) {
          authService.refreshToken(refreshToken).subscribe({
            next: (res) => {
              localStorage.setItem('token', res.result.accessToken);
              localStorage.setItem('refreshToken', res.result.refreshToken);
              window.location.reload();
            },
            error: (err) => {
              store.dispatch(
                openNoticeModal({
                  payload: {
                    title: 'Hết hạn đăng nhập',
                    message: 'Để tiếp tục sử dụng yêu cầu đăng nhập lại!',
                    confirmText: 'Đồng ý',
                    cancelText: 'Hủy',
                    onConfirm: () => {
                      router.navigate(['/auth/identity/login']);
                    },
                    onCancel: () => {
                      // Hành động khi hủy
                    },
                  },
                })
              );
            },
          });
        } else if (errorCode === 4018801 && !refreshToken) {
          store.dispatch(
            openNoticeModal({
              payload: {
                title: 'Hết hạn đăng nhập',
                message: 'Để tiếp tục sử dụng yêu cầu đăng nhập lại!',
                confirmText: 'Đồng ý',
                cancelText: 'Hủy',
                onConfirm: () => {
                  router.navigate(['/auth/identity/login']);
                },
                onCancel: () => {
                  // Hành động khi hủy
                  sendNotification(store, errorStatus, errorMessage, 'error');
                },
              },
            })
          );
        } else {
          sendNotification(store, errorStatus, errorMessage, 'error');
        }
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
