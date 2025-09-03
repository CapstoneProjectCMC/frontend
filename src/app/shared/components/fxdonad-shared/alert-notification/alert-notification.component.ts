import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Subject, timer } from 'rxjs';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-notification-card',
  templateUrl: './alert-notification.component.html',
  styleUrl: './alert-notification.component.scss',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('notificationState', [
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(0) scale(1)',
        })
      ),
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(-20px) scale(0.95)',
        })
      ),
      transition('hidden => visible', [
        style({
          opacity: 0,
          transform: 'translateY(-20px) scale(0.95)',
        }),
        animate(
          '400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          })
        ),
      ]),
      transition('visible => hidden', [
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({
            opacity: 0,
            transform: 'translateY(-20px) scale(0.95)',
          })
        ),
      ]),
    ]),
  ],
})
export class AlertNotificationComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() type: NotificationType = 'info';
  @Input() timestamp: Date = new Date();
  @Input() autoClose: boolean = true;
  @Input() duration: number = 5000; // Thời gian hiển thị (mặc định 5 giây)

  @Output() closed = new EventEmitter<void>();
  @Output() clicked = new EventEmitter<void>();

  state: 'visible' | 'hidden' = 'hidden'; // Bắt đầu với trạng thái ẩn
  private destroy$ = new Subject<void>();
  progress: number = 100; // Tiến trình ban đầu là 100%

  ngOnInit() {
    // Hiển thị notification sau một khoảng thời gian ngắn
    setTimeout(() => {
      this.state = 'visible';
    }, 100);

    if (this.autoClose) {
      const intervalTime = 10; // Mỗi 10ms cập nhật tiến trình
      const steps = this.duration / intervalTime; // Tổng số bước
      let step = 0;

      const interval = setInterval(() => {
        this.progress = Math.max(0, 100 - (step / steps) * 100);
        step++;

        if (step >= steps) {
          clearInterval(interval);
          this.dismiss();
        }
      }, intervalTime);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFormattedMessage(message: string): string {
    return message.replace(/\n/g, '<br>');
  }

  getIconClass(): string {
    const icons = {
      success: 'fa-solid fa-circle-check',
      warning: 'fa-solid fa-triangle-exclamation',
      error: 'fa-solid fa-circle-xmark',
      info: 'fa-solid fa-circle-info',
    };
    return icons[this.type];
  }

  dismiss(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.state = 'hidden';
    setTimeout(() => this.closed.emit(), 300);
  }

  onClick() {
    this.clicked.emit();
  }
}
