import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  HostListener,
} from '@angular/core';
import { AuthService } from '../../../../core/services/api-service/auth.service';
import { sendNotification } from '../../../utils/notification';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  clearLoading,
  setLoading,
} from '../../../store/loading-state/loading.action';
import { ChangePasswordComponent } from '../../../../features/auth/components/modal/change-password/change-password.component';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [ChangePasswordComponent],
})
export class ProfileMenuComponent {
  @Input() isVisible: boolean = false;
  @Output() closeMenu = new EventEmitter<void>();

  status = '';
  loading = false;

  isOpenChangePassword = false;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private store: Store,
    private router: Router
  ) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.isVisible &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.closeMenu.emit();
    }
  }
  goToProfile = () => {
    this.router.navigate(['/profile/personal-profile']);
    this.isVisible = false;
    this.closeMenu.emit();
  };

  openChangePasswordModal() {
    this.isOpenChangePassword = !this.isOpenChangePassword;
    this.isVisible = false;
  }

  onCloseModal($event: boolean) {
    this.isOpenChangePassword = $event;
    this.closeMenu.emit();
  }

  onLogout() {
    this.store.dispatch(
      setLoading({ isLoading: true, content: 'Đang đăng xuất, xin chờ...' })
    );
    this.authService.logout().subscribe({
      next: (res) => {
        this.store.dispatch(clearLoading());
        this.status = res.status;
        this.router.navigate(['/auth/identity/login']);
      },
      error: (err) => {
        this.store.dispatch(clearLoading());
        this.router.navigate(['/auth/identity/login']);
        console.log('lỗi logout');
      },
    });
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('avatar-url');
  }
}
