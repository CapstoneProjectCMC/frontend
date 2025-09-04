// notification-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAllNoticeResponse } from '../../../../../core/models/notice.model';
import { NotificationListService } from '../../../../../core/services/api-service/notification-list.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate(
          '250ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-20px)' })
        ),
      ]),
    ]),
  ],
})
export class NotificationModalComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  notifications: GetAllNoticeResponse[] = [];
  isLoading = false;
  page = 1;
  size = 10;
  totalPages = 1;

  constructor(private notificationService: NotificationListService) {}

  ngOnInit() {
    if (this.isOpen) {
      this.loadNotifications();
    }
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.loadNotifications(true);
    }
  }

  loadNotifications(reset = false) {
    if (reset) {
      this.page = 1;
      this.notifications = [];
    }
    this.isLoading = true;
    this.notificationService
      .getAllMyNotification(this.page, this.size, 'ALL')
      .subscribe({
        next: (res) => {
          this.notifications.push(...res.result.data);
          this.totalPages = res.result.totalPages;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
  }

  markAsRead(id: string) {
    this.notificationService.markAsReadNotification([id]).subscribe(() => {
      const item = this.notifications.find((n) => n.id === id);
      if (item) item.readStatus = 'READ';
    });
  }

  markAllAsRead() {
    const ids = this.notifications.map((n) => n.id);
    this.notificationService.markAsReadNotification(ids).subscribe(() => {
      this.notifications.forEach((n) => (n.readStatus = 'READ'));
    });
  }

  loadMore() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadNotifications();
    }
  }

  closeModal() {
    this.closed.emit();
  }
}
