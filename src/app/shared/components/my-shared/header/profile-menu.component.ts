import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  HostListener,
} from '@angular/core';
import { AuthService } from '../../../../core/services/api-service/auth.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  clearLoading,
  setLoading,
} from '../../../store/loading-state/loading.action';
import { ChangePasswordComponent } from '../../../../features/auth/components/modal/change-password/change-password.component';
import { Observable } from 'rxjs';
import { selectVariable } from '../../../store/variable-state/variable.selectors';
import { CommonModule } from '@angular/common';
import { setVariable } from '../../../store/variable-state/variable.actions';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [ChangePasswordComponent, CommonModule],
})
export class ProfileMenuComponent {
  @Input() isVisible: boolean = false;
  @Input() needSetNewPass: boolean = false;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() openSetPassword = new EventEmitter<boolean>();

  status = '';
  loading = false;
  isOpenChangePassword = false;
  isPasswordModalOpen: boolean = false;

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

  openSetPasswordModal() {
    this.openSetPassword.emit(true);
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
    localStorage.removeItem('needPasswordSetup');
    sessionStorage.removeItem('avatar-url');
  }
}
