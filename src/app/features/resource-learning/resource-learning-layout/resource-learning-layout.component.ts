import { Component } from '@angular/core';
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { Router, RouterModule } from '@angular/router';
import { SidebarItem } from '../../../core/models/data-handle';
import { decodeJWT } from '../../../shared/utils/stringProcess';
import { CommonModule } from '@angular/common';
import { sidebarResourceLearningRouter } from '../../../core/router-manager/vetical-menu-dynamic/resource-learning-vertical-menu';

@Component({
  selector: 'app-resource-learning-layout',
  imports: [MainSidebarComponent, RouterModule, CommonModule],
  templateUrl: './resource-learning-layout.component.html',
  styleUrl: './resource-learning-layout.component.scss',
})
export class ResourceLearningLayoutComponent {
  isSidebarCollapsed = true;
  sidebarData: SidebarItem[] = [];

  showSidebar = true;

  constructor(private router: Router) {
    const role = decodeJWT(localStorage.getItem('token') ?? '')?.payload.scope;
    this.sidebarData = sidebarResourceLearningRouter(role);
  }
}
