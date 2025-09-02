import { Component } from '@angular/core';
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { sidebarOrganizations } from '../../../core/constants/menu-router.data';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from '../../dashboard/dashboard-routing.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-organization',
  imports: [
    RouterOutlet,
    CommonModule,
    MainSidebarComponent,
    AdminRoutingModule,
  ],
  templateUrl: './layout-organization.component.html',
  styleUrl: './layout-organization.component.scss',
})
export class LayoutOrganizationComponent {
  isSidebarCollapsed = true;
  sidebarData = sidebarOrganizations;

  showSidebar = true;
}
