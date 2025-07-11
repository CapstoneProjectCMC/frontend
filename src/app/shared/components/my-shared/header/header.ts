import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProfileMenuComponent } from './profile-menu.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  standalone: true,
  imports: [NgIf, ProfileMenuComponent],
})
export class HeaderComponent {
  @Input() isLoggedIn: boolean = false;
  @Input() notificationCount: number = 0;
  showProfileMenu = false;
  constructor(private router: Router, private store: Store) {}

  goToLogin() {
    this.router.navigate(['/main/auth/login']);
  }
  goToRegister() {
    this.router.navigate(['/main/auth/register']);
  }
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    console.log('đã bấm, showProfileMenu:', this.showProfileMenu);
  }
  onLogout() {
    // TODO: Xử lý đăng xuất
    this.showProfileMenu = false;
  }
}
