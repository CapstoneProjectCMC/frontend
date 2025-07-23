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
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { sidebarData } from '../../../features/admin/menu-router.data';
import { BreadcrumbComponent } from '../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    MenuLayoutComponent,
    MainSidebarComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss'],
})
export class AdminLayoutComponent implements OnInit {
  visible = true;
  menuItems = navStudentItems;
  sidebarData = sidebarData;
  isCollapsed = false;
  constructor(private router: Router) {}

  ngOnInit() {
    // Cập nhật visible ngay khi khởi tạo dựa trên url hiện tại
    const currentUrl = this.router.url;
    this.visible = currentUrl !== '/';

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.visible = event.urlAfterRedirects !== '/';
      });
  }
}
