import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from '../../../shared/components/my-shared/header/header';
import { FooterComponent } from '../../../shared/components/my-shared/footer/footer';
import { MenuLayoutComponent } from '../../layout-components/menu/menu-layout.component';
import { menuItems } from '../../../core/constants/menu-router.data';
import { CommonModule } from '@angular/common';

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
  menuItems = menuItems;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('Current URL:', event.urlAfterRedirects);
        // Nếu url là "/" thì ẩn, ngược lại thì hiện
        this.visible = event.urlAfterRedirects !== '/';
      });
  }
}
