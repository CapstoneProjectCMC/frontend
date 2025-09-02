import { Component } from '@angular/core';
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarItem } from '../../../core/models/data-handle';
import { decodeJWT } from '../../../shared/utils/stringProcess';
import { sidebarPosts } from '../../../core/router-manager/vetical-menu-dynamic/post-vertical-menu';

@Component({
  selector: 'app-post-layout',
  imports: [CommonModule, MainSidebarComponent, RouterModule],
  templateUrl: './post-layout.component.html',
  styleUrl: './post-layout.component.scss',
})
export class PostLayoutComponent {
  isSidebarCollapsed = true;
  sidebarData: SidebarItem[] = [];

  showSidebar = true;

  constructor(private router: Router) {
    const roles = decodeJWT(localStorage.getItem('token') ?? '')?.payload.roles;
    this.sidebarData = sidebarPosts(roles);
  }
}
