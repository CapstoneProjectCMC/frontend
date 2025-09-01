// core/services/error-handler.service.ts
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { openNoticeModal } from '../../../shared/store/modal-notice-state/modal-notice.actions';
import { sendNotification } from '../../../shared/utils/notification';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private store = inject(Store);
  private router = inject(Router);

  handle(
    errorCode: number,
    errorStatus: string,
    errorMessage: string,
    refreshToken?: string | null
  ) {
    if (errorCode === 4018801 && !refreshToken) {
      this.store.dispatch(
        openNoticeModal({
          payload: {
            title: 'Hết hạn đăng nhập',
            message: 'Để tiếp tục sử dụng yêu cầu đăng nhập lại!',
            confirmText: 'Đồng ý',
            cancelText: 'Hủy',
            onConfirm: () => {
              this.router.navigate(['/auth/identity/login']);
            },
            onCancel: () => {
              sendNotification(this.store, errorStatus, errorMessage, 'error');
            },
          },
        })
      );
    } else if (errorCode === 4059103) {
      sendNotification(
        this.store,
        'Sản phẩm đã mua',
        'Bạn đã mua sản phẩm này rồi!',
        'warning'
      );
    } else {
      sendNotification(
        this.store,
        errorStatus === '0' ? 'Lỗi kết nối!' : errorStatus,
        errorMessage,
        'error'
      );
    }
  }
}
