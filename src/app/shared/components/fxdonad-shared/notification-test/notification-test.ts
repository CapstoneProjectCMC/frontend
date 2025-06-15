import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addNotification,
  removeNotification,
  clearNotifications,
} from '../../../store/notification/notification.action';
import { selectNotifications } from '../../../store/notification/notification.selector';

import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { INotification } from '../../../../core/models/notification.models';

@Component({
  imports: [CommonModule],
  selector: 'app-notification-test',
  templateUrl: './notification-test.html',
  styleUrl: './notification-test.scss',
})
export class NotificationTestComponent {
  notifications$: Observable<INotification[]>;

  constructor(private store: Store) {
    this.notifications$ = this.store.select(selectNotifications);
  }

  add() {
    const notification: INotification = {
      id: crypto.randomUUID(), // hoặc bất kỳ ID nào
      title: 'Test',
      message: 'Thông báo test ' + Math.floor(Math.random() * 1000),
      type: 'error',
      timestamp: new Date(),
    };
    this.store.dispatch(addNotification({ notification }));
  }

  remove() {
    // để test, bạn cần lấy state trước -> hoặc hardcode
    // ví dụ: xóa 1 cái cụ thể (thực tế nên chọn từ UI)
    this.store.dispatch(removeNotification({ id: 'test-id' }));
  }

  clear() {
    this.store.dispatch(clearNotifications());
  }
}
