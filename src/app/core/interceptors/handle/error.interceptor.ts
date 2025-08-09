import { of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { openNoticeModal } from '../../../shared/store/modal-notice-state/modal-notice.actions';
import { sendNotification } from '../../../shared/utils/notification';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from '../../services/api-service/auth.service';
import {
  IGNORE_ERROR_NOTIFICATION_URLS,
  IGNORE_ERROR_REGEX_PATTERNS,
} from '../config/ignoreApiHandleError';
import { ERROR_MESSAGES } from '../config/codeResponse';

// Hàm kiểm tra URL có nằm trong danh sách bỏ qua không
const shouldIgnoreErrorNotification = (url: string): boolean => {
  // Kiểm tra string patterns
  const stringMatch = IGNORE_ERROR_NOTIFICATION_URLS.some((pattern) => {
    // Bỏ qua comment pattern
    if (pattern.includes('dành cho endpoint')) return false;

    // Kiểm tra URL có chứa pattern không
    return url.includes(pattern);
  });

  // Kiểm tra regex patterns
  const regexMatch = IGNORE_ERROR_REGEX_PATTERNS.some((pattern) => {
    return pattern.test(url);
  });

  return stringMatch || regexMatch;
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);
  const refreshToken = localStorage.getItem('refreshToken');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorCode = error.status;
      let errorMessage = 'Không thể kết nối tới máy chủ!';
      const errorStatus = `${error.status}`;

      if (error.error && typeof error.error === 'object') {
        errorCode = error.error.code || error.status;
        errorMessage =
          ERROR_MESSAGES[errorCode] || error.error.message || errorMessage;
      }

      const shouldSkip = shouldIgnoreErrorNotification(req.url);

      // Trường hợp đặc biệt: Token hết hạn & có refreshToken
      if (errorCode === 4018801 && refreshToken) {
        return authService.refreshToken(refreshToken).pipe(
          switchMap((res) => {
            localStorage.setItem('token', res.result.accessToken);
            localStorage.setItem('refreshToken', res.result.refreshToken);

            // Thêm Authorization mới vào headers
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.result.accessToken}`,
              },
            });

            // Gọi lại request ban đầu
            return next(clonedReq);
          }),
          catchError((refreshErr) => {
            store.dispatch(
              openNoticeModal({
                payload: {
                  title: 'Thông tin xác thực không hợp lệ',
                  message: 'Yêu cầu đăng nhập lại!',
                  confirmText: 'Đồng ý',
                  cancelText: 'Hủy',
                  onConfirm: () => {
                    router.navigate(['/auth/identity/login']);
                  },
                },
              })
            );
            return throwError(() => refreshErr);
          })
        );
      }

      // Hiển thị thông báo nếu không nằm trong danh sách bỏ qua
      if (!shouldSkip) {
        if (errorCode === 4018801 && !refreshToken) {
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
                  sendNotification(store, errorStatus, errorMessage, 'error');
                },
              },
            })
          );
        } else {
          sendNotification(
            store,
            errorStatus === '0' ? 'Lỗi kết nối!' : errorStatus,
            errorMessage,
            'error'
          );
        }
      }

      return throwError(() => ({
        code: errorCode,
        message: errorMessage,
        status: errorStatus,
      }));
    })
  );
};
