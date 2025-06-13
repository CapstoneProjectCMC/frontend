import { createSelector, createFeatureSelector } from '@ngrx/store';
import { INotificationState } from './notification.reducer';

// Lấy state của notification
export const selectNotificationState =
  createFeatureSelector<INotificationState>('notification');

// ✅ Lấy danh sách thông báo
export const selectNotifications = createSelector(
  selectNotificationState,
  (state) => state.notifications
);
