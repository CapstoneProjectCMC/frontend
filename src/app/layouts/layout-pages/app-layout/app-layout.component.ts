import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from '../../../shared/components/my-shared/header/header';
import { FooterComponent } from '../../../shared/components/my-shared/footer/footer';
import { MenuLayoutComponent } from '../../layout-components/menu/menu-layout.component';
import {
  menuItems,
  navStudentItems,
} from '../../../core/constants/menu-router.data';
import { CommonModule } from '@angular/common';
import { getNavHorizontalItems } from '../../../core/router-manager/horizontal-menu';
import { decodeJWT } from '../../../shared/utils/stringProcess';
import { SidebarItem } from '../../../core/models/data-handle';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MenuLayoutComponent,
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit {
  visible = true;
  menuItems: SidebarItem[] | [] = [];
  showFooter = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const role = decodeJWT(localStorage.getItem('token') ?? '')?.payload.scope;
    // Cập nhật visible ngay khi khởi tạo dựa trên url hiện tại
    this.menuItems = getNavHorizontalItems(role);
    const currentUrl = this.router.url;
    this.visible = currentUrl !== '/';
    this.showFooter = currentUrl === '/' || currentUrl === '';

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.visible = event.urlAfterRedirects !== '/';
        this.showFooter = event.urlAfterRedirects === '/';
      });
  }
}
