import { Component, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProfileMenuComponent } from './profile-menu.component';
import { decodeJWT } from '../../../utils/stringProcess';
import { ToggleSwitch } from '../../fxdonad-shared/toggle-switch/toggle-switch';
import { ThemeService } from '../../../../styles/theme-service/theme.service';
import { ProfileService } from '../../../../core/services/api-service/profile.service';
import { Observable } from 'rxjs';
import { selectVariable } from '../../../store/variable-state/variable.selectors';
import { resetVariable } from '../../../store/variable-state/variable.actions';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';
import { SetPasswordModalComponent } from '../../../../features/auth/components/modal/set-password-modal/set-password-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  standalone: true,
  imports: [
    NgIf,
    ProfileMenuComponent,
    ToggleSwitch,
    SetPasswordModalComponent,
  ],
})
export class HeaderComponent {
  needReloadAvatar$: Observable<boolean>;

  isDarkMode: boolean = false;
  notificationCount: number = 10;
  isLoggedIn: boolean = false;
  showProfileMenu = false;
  isMenuVisible = false;
  timeExpiresAt: string = '';
  role: string = '';
  avatarUrl: string = '';
  avatarDefault = avatarUrlDefault;
  setPassword = false;
  needCreateNewPass = false;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private themeService: ThemeService,
    private store: Store
  ) {
    this.needReloadAvatar$ = this.store.select(
      selectVariable('reloadAvatarHeader')
    );

    this.timeExpiresAt =
      decodeJWT(localStorage.getItem('token') ?? '')?.expiresAt || '';
    const expiresAt = new Date(this.timeExpiresAt).getTime();
    this.isLoggedIn = !isNaN(expiresAt) && Date.now() < expiresAt;

    this.role =
      decodeJWT(localStorage.getItem('token') ?? '')?.payload.roles || '';
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
  }

  organizations = [
    { value: 0, label: 'Cộng đồng' },
    { value: 1, label: 'Hội kín' },
  ];

  selectedOptions: { [key: string]: any } = {};

  onSelectedOganization(selected: any) {
    this.selectedOptions = selected;

    console.log(this.selectedOptions);
  }

  goToLogin() {
    this.router.navigate(['/auth/identity/login']);
  }

  goToRegister() {
    this.router.navigate(['/auth/identity/register']);
  }

  goToHome() {
    console.log('Click về trang chủ');
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
    console.log('đã bấm, showProfileMenu:', this.showProfileMenu);
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
