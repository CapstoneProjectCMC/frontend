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
import { takeUntil } from 'rxjs/operators';

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
          transform: 'translateY(0)',
        })
      ),
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(-100%)',
        })
      ),
      transition('hidden => visible', animate('300ms ease-in')),
      transition('visible => hidden', animate('300ms ease-out')),
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

  state: 'visible' | 'hidden' = 'visible';
  private destroy$ = new Subject<void>();
  progress: number = 100; // Tiến trình ban đầu là 100%

  ngOnInit() {
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

  getIcon(): string {
    const icons = {
      success: '✅',
      warning: '‼‼',
      error: '❌',
      info: '💦',
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
