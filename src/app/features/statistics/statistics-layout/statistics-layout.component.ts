import { Component } from '@angular/core';
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { SidebarItem } from '../../../core/models/data-handle';
import { decodeJWT } from '../../../shared/utils/stringProcess';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { sidebarStatisticsRouter } from '../../../core/router-manager/vetical-menu-dynamic/statistics-vetical-menu';

@Component({
  selector: 'app-statistics-layout',
  imports: [CommonModule, MainSidebarComponent, RouterModule],
  templateUrl: './statistics-layout.component.html',
  styleUrls: ['./statistics-layout.component.scss'],
})
export class StatisticsLayoutComponent {
  isSidebarCollapsed = true;
  sidebarData: SidebarItem[] = [];

  showSidebar = true;

  constructor() {
    const roles = decodeJWT(localStorage.getItem('token') ?? '')?.payload.roles;
    this.sidebarData = sidebarStatisticsRouter(roles);
  }
}
