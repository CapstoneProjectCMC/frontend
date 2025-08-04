import { Store } from '@ngrx/store';
import { addNotification } from '../store/notification/notification.action';
import { INotification } from '../../core/models/notification.models';
import {
  NoticeModalPayload,
  openNoticeModal,
} from '../store/modal-notice-state/modal-notice.actions';

/**
 * Hàm tạo và gửi thông báo vào store
 * @param store Store của ứng dụng để dispatch action
 * @param title Tiêu đề của thông báo
 * @param message Nội dung của thông báo
 * @param type Loại thông báo (success, error, warning, info)
 */
export function sendNotification(
  store: Store,
  title: string,
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'error'
): void {
  const notification: INotification = {
    id: Date.now().toString(),
    title: title,
    message: message,
    type: type,
    timestamp: new Date(),
  };

  // Dispatch action để thêm notification vào store
  store.dispatch(addNotification({ notification }));
}

export function openModalNotification(
  store: Store,
  title: string,
  message: string,
  confirmText: string,
  cancelText: string,
  onConfirm?: () => void,
  onCancel?: () => void
): void {
  const notification: NoticeModalPayload = {
    title: title,
    message: message,
    confirmText: confirmText,
    cancelText: cancelText,
    onConfirm:
      onConfirm ||
      (() => {
        // Hành động mặc định khi xác nhận
        console.log('Xác nhận mặc định');
      }),
    onCancel:
      onCancel ||
      (() => {
        // Hành động mặc định khi hủy
        console.log('Hủy mặc định');
      }),
  };

  store.dispatch(
    openNoticeModal({
      payload: notification,
    })
  );
}

//cách dùng:
/*
  openModalNotification(
    this.store,
    'Xác nhận',
    'Bạn có muốn tiếp tục?',
    'Có',
    'Không',
    () => this.handleConfirm(),
    () => this.handleCancel()
  );
*/
