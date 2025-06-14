import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './styles/theme-service/theme.service';
import { NotificationTestComponent } from './shared/components/notification-test/notification-test';
import { INotification } from './core/models/notification.models';
import { Observable } from 'rxjs';
import { selectNotifications } from './shared/store/notification/notification.selector';
import { Store } from '@ngrx/store';
import { AlertNotificationComponent } from './shared/components/alert-notification/alert-notification.component';
import { removeNotification } from './shared/store/notification/notification.action';
import { CommonModule } from '@angular/common';
import { Tooltip } from './shared/components/tooltip/tooltip';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    NotificationTestComponent,
    AlertNotificationComponent,
    Tooltip,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  notifications$: Observable<INotification[]>;
  protected title = 'codecampus';

  constructor(private themeService: ThemeService, private store: Store) {
    this.notifications$ = this.store.select(selectNotifications);
  }

  ngOnInit() {
    this.themeService.initTheme();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  switchTheme(theme: 'light' | 'dark') {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }

  // Xóa thông báo theo ID
  removeNotification(id: string) {
    this.store.dispatch(removeNotification({ id }));
  }
}
