import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProfileMenuComponent } from './profile-menu.component';
import { ToggleSwitch } from '../../fxdonad-shared/toggle-switch/toggle-switch';
import { ThemeService } from '../../../../styles/theme-service/theme.service';
import { ProfileService } from '../../../../core/services/api-service/profile.service';
import { Observable } from 'rxjs';
import { selectVariable } from '../../../store/variable-state/variable.selectors';
import { resetVariable } from '../../../store/variable-state/variable.actions';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';
import { SetPasswordModalComponent } from '../../../../features/auth/components/modal/set-password-modal/set-password-modal.component';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { NotificationSocketService } from '../../../../core/services/socket-service/notification-socket.service';
import { NotificationListService } from '../../../../core/services/api-service/notification-list.service';
import { sendNotification } from '../../../utils/notification';
import { checkAuthenticated } from '../../../utils/authenRoleActions';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  standalone: true,
  imports: [
    ProfileMenuComponent,
    ToggleSwitch,
    SetPasswordModalComponent,
    NotificationModalComponent,
  ],
})
export class HeaderComponent {
  needReloadAvatar$: Observable<boolean>;

  isDarkMode: boolean = false;
  notificationCount: number = 0;
  isLoggedIn: boolean = false;
  showProfileMenu = false;
  isMenuVisible = false;
  timeExpiresAt: Date = new Date();
  avatarUrl: string = '';
  avatarDefault = avatarUrlDefault;
  setPassword = false;
  needCreateNewPass = false;
  showNotificationModal = false;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private themeService: ThemeService,
    private store: Store,
    private notificationService: NotificationSocketService,
    private notificationListService: NotificationListService
  ) {
    this.needReloadAvatar$ = this.store.select(
      selectVariable('reloadAvatarHeader')
    );
  }

  ngOnInit() {
    this.needReloadAvatar$.subscribe((reload) => {
      if (reload) {
        const avatarUrl = sessionStorage.getItem('avatar-url');
        if (!avatarUrl) {
          this.getUserInfo();
        } else {
          this.avatarUrl = avatarUrl;
        }
      }
    });

    this.avatarUrl = sessionStorage.getItem('avatar-url') ?? '';
    if (!this.avatarUrl) {
      this.getUserInfo();
    }

    this.needCreateNewPass = JSON.parse(
      localStorage.getItem('needPasswordSetup') || 'false'
    );

    //Đăng ký lắng nghe notification từ socket
    this.notificationService.listenNoticeCount().subscribe((event) => {
      this.notificationCount = event.unread;
    });

    this.notificationService.listenNotifications().subscribe((notice) => {
      sendNotification(this.store, 'Thông báo mới', notice.body, 'info');
    });

    this.getCountNotice();

    //kiểm tra trạng thái đăng nhập có hợp lệ không
    this.isLoggedIn = checkAuthenticated();
  }

  organizations = [
    { value: 0, label: 'Cộng đồng' },
    { value: 1, label: 'Hội kín' },
  ];

  selectedOptions: { [key: string]: any } = {};

  onSelectedOganization(selected: any) {
    this.selectedOptions = selected;
  }

  toggleNotification() {
    this.showNotificationModal = !this.showNotificationModal;
  }

  goToLogin() {
    this.router.navigate(['/auth/identity/login']);
  }

  goToRegister() {
    this.router.navigate(['/auth/identity/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  getUserInfo() {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.result.avatarUrl !== null) {
          sessionStorage.setItem('avatar-url', res.result.avatarUrl);
          this.avatarUrl = sessionStorage.getItem('avatar-url') ?? '';
          this.store.dispatch(resetVariable({ key: 'reloadAvatarHeader' })); //reset biến để dùng cho các lần update tiếp
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCountNotice() {
    this.notificationListService.countMyUnread().subscribe({
      next: (res) => {
        this.notificationCount = res.result;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  toggleProfileMenu() {
    if (this.showProfileMenu) {
      this.isMenuVisible = false;
      setTimeout(() => {
        this.showProfileMenu = false;
      }, 300); // Thời gian transition
    } else {
      this.showProfileMenu = true;
      this.isMenuVisible = true; // Set ngay lập tức để tránh flash
    }
  }

  toggleTheme(isChecked: boolean) {
    this.themeService.toggleTheme();
    this.isDarkMode = isChecked;
  }

  onCloseMenu() {
    this.isMenuVisible = false;
    setTimeout(() => {
      this.showProfileMenu = false;
    }, 300);
  }

  openSetPassword($event: boolean) {
    this.setPassword = $event;
  }
}
