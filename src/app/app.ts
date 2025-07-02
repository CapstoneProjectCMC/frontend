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

  // Xóa thông báo theo ID
  removeNotification(id: string) {
    this.store.dispatch(removeNotification({ id }));
  }
}
