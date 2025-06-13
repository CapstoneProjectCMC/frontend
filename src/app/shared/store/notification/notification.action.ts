import { createAction, props } from '@ngrx/store';
import { INotification } from '../../../core/models/notification.models';

// ✅ Thêm thông báo
export const addNotification = createAction(
  '[Notification] Add',
  props<{ notification: INotification }>()
);

// ✅ Xóa thông báo cụ thể theo id
export const removeNotification = createAction(
  '[Notification] Remove',
  props<{ id: string }>()
);

// ✅ Xóa tất cả thông báo
export const clearNotifications = createAction('[Notification] Clear All');
