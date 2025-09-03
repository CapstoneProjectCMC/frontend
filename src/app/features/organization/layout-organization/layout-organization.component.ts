import { Component } from '@angular/core';
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';

import { AdminRoutingModule } from '../../dashboard/dashboard-routing.module';
import { Router, RouterOutlet } from '@angular/router';
import { sidebarOrgRouter } from '../../../core/router-manager/vetical-menu-dynamic/org-vertical-menu';
import { SidebarItem } from '../../../core/models/data-handle';
import { decodeJWT } from '../../../shared/utils/stringProcess';

@Component({
  selector: 'app-layout-organization',
  imports: [
    RouterOutlet,
    MainSidebarComponent,
    AdminRoutingModule
],
  templateUrl: './layout-organization.component.html',
  styleUrl: './layout-organization.component.scss',
})
export class LayoutOrganizationComponent {
  isSidebarCollapsed = true;
  sidebarData: SidebarItem[] = [];

  showSidebar = true;

  constructor(private router: Router) {
    const roles = decodeJWT(localStorage.getItem('token') ?? '')?.payload.roles;
    this.sidebarData = sidebarOrgRouter(roles);
  }
}
