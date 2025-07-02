import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  standalone: true,
  imports: [NgIf],
})
export class HeaderComponent {
  @Input() isLoggedIn: boolean = false;
  @Input() notificationCount: number = 0;
  constructor(private router: Router, private store: Store) {}

  goToLogin() {
    this.router.navigate(['/main/auth/login']);
  }
  goToRegister() {
    this.router.navigate(['/main/auth/register']);
  }
}
