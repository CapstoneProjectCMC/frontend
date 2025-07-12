import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProfileMenuComponent } from './profile-menu.component';
import { DropdownButtonComponent } from '../../fxdonad-shared/dropdown/dropdown.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  standalone: true,
  imports: [NgIf, ProfileMenuComponent, DropdownButtonComponent],
})
export class HeaderComponent {
  @Input() isLoggedIn: boolean = false;
  @Input() notificationCount: number = 0;
  showProfileMenu = false;
  isMenuVisible = false;
  constructor(private router: Router, private store: Store) {}

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

  onLogout() {
    // TODO: Xử lý đăng xuất
    this.isMenuVisible = false;
    setTimeout(() => {
      this.showProfileMenu = false;
    }, 300);
  }

  onCloseMenu() {
    this.isMenuVisible = false;
    setTimeout(() => {
      this.showProfileMenu = false;
    }, 300);
  }
}
