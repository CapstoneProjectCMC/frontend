import { Store } from '@ngrx/store';
import { addNotification } from '../store/notification/notification.action';
import { INotification } from '../../core/models/notification.models';

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
