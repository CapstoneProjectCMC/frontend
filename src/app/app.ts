import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './styles/theme-service/theme.service';
import { INotification } from './core/models/notification.models';
import { Observable } from 'rxjs';
import { selectNotifications } from './shared/store/notification/notification.selector';
import { Store } from '@ngrx/store';
import { AlertNotificationComponent } from './shared/components/fxdonad-shared/alert-notification/alert-notification.component';
import { removeNotification } from './shared/store/notification/notification.action';
import { CommonModule } from '@angular/common';
import { Tooltip } from './shared/components/fxdonad-shared/tooltip/tooltip';
import { ToggleSwitch } from './shared/components/fxdonad-shared/toggle-switch/toggle-switch';
import { BreadcrumbComponent } from './shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    AlertNotificationComponent,
    Tooltip,
    ToggleSwitch,
    BreadcrumbComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [
    trigger('stackAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px) scale(0.95)' }),
        animate(
          '300ms cubic-bezier(0.23, 1, 0.32, 1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms cubic-bezier(0.23, 1, 0.32, 1)',
          style({ opacity: 0, transform: 'translateY(-20px) scale(0.95)' })
        ),
      ]),
    ]),
  ],
})
export class App implements OnInit {
  notifications$: Observable<INotification[]>;
  protected title = 'codecampus';
  isDarkMode: boolean = false;

  constructor(private themeService: ThemeService, private store: Store) {
    this.notifications$ = this.store.select(selectNotifications);
  }

  ngOnInit() {
    // Khởi tạo theme từ localStorage
    this.themeService.initTheme();
    this.isDarkMode = this.themeService.getCurrentTheme() === 'dark';
  }

  toggleTheme(isChecked: boolean) {
    this.themeService.toggleTheme();
    this.isDarkMode = isChecked;
  }

  trackById(index: number, notif: any) {
    return notif.id;
  }

  // Xóa thông báo theo ID
  removeNotification(id: string) {
    this.store.dispatch(removeNotification({ id }));
  }
}
