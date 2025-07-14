import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProfileMenuComponent } from './profile-menu.component';
import { DropdownButtonComponent } from '../../fxdonad-shared/dropdown/dropdown.component';
import { DecodedJwtPayload } from '../../../../core/models/data-handle';
import { decodeJWT } from '../../../utils/stringProcess';
import { timeout } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  standalone: true,
  imports: [NgIf, ProfileMenuComponent, DropdownButtonComponent],
})
export class HeaderComponent {
  notificationCount: number = 10;
  isLoggedIn: boolean = false;
  showProfileMenu = false;
  isMenuVisible = false;
  timeExpiresAt: string = '';
  role: string = '';

  constructor(private router: Router, private store: Store) {
    this.timeExpiresAt =
      decodeJWT(localStorage.getItem('token') ?? '')?.expiresAt || '';
    const expiresAt = new Date(this.timeExpiresAt).getTime();
    this.isLoggedIn = !isNaN(expiresAt) && Date.now() < expiresAt;

    this.role =
      decodeJWT(localStorage.getItem('token') ?? '')?.payload.roles || '';
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

  onCloseMenu() {
    this.isMenuVisible = false;
    setTimeout(() => {
      this.showProfileMenu = false;
    }, 300);
  }
}
