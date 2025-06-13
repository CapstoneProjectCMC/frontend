import { createReducer, on } from '@ngrx/store';
import {
  addNotification,
  removeNotification,
  clearNotifications,
} from './notification.action';
import { INotification } from '../../../core/models/notification.models';

// Trạng thái ban đầu của notifications (mảng rỗng)
export interface INotificationState {
  notifications: INotification[];
}

const initialState: INotificationState = {
  notifications: [],
};

// ✅ Reducer xử lý trạng thái notifications
export const notificationReducer = createReducer(
  initialState,

  // Thêm thông báo vào danh sách
  on(addNotification, (state, { notification }) => ({
    ...state,
    notifications: [...state.notifications, notification],
  })),

  // Xóa thông báo theo id
  on(removeNotification, (state, { id }) => ({
    ...state,
    notifications: state.notifications.filter((notif) => notif.id !== id),
  })),

  // Xóa tất cả thông báo
  on(clearNotifications, (state) => ({
    ...state,
    notifications: [],
  }))
);
