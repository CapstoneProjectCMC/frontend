import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MenuLayoutComponent } from '../../../layouts/layout-components/menu/menu-layout.component';
import { SidebarItem } from '../../../core/models/data-handle';

@Component({
  selector: 'app-layout-with-menu',
  standalone: true,
  imports: [RouterModule, MenuLayoutComponent],
  template: `
    <div class="layout-container">
      <!-- Menu Layout -->
      <app-menu-layout [menuItems]="menuItems" mode="horizontal" theme="light">
      </app-menu-layout>
    </div>
  `,
  styles: [
    `
      .layout-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .app-header {
        background: var(--background-color);
        border-bottom: 1px solid var(--border-color);
        padding: 0;
        height: 64px;
        display: flex;
        align-items: center;
      }

      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .logo h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: var(--primary-color);
      }

      .header-actions {
        display: flex;
        gap: 12px;
      }

      .header-actions button {
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--background-color);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .header-actions button:hover {
        background: var(--hover-color);
      }

      .main-content {
        flex: 1;
        padding: 24px;
        background: var(--background-color);
      }

      @media (max-width: 768px) {
        .header-content {
          padding: 0 16px;
        }

        .logo h1 {
          font-size: 20px;
        }

        .main-content {
          padding: 16px;
        }
      }
    `,
  ],
})
export class LayoutWithMenuComponent {
  menuItems: SidebarItem[] = [
    {
      id: 'home',
      path: 'second/example-using-component-slide/app-menu-layout',
      label: 'Home',
      icon: 'fas fa-home',
      isActive: true,
    },
    {
      id: 'dashboard',
      path: '/second/dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
    },
    {
      id: 'components',
      path: '/second/example-using-component-slide',
      label: 'Components',
      icon: 'fas fa-code',
      children: [
        {
          id: 'code-editor',
          path: '/second/example-using-component-slide/code-editor',
          label: 'Code Editor',
          icon: 'fas fa-file-code',
        },
        {
          id: 'input-button',
          path: '/second/example-using-component-slide/input-button',
          label: 'Input Button',
          icon: 'fas fa-keyboard',
        },
        {
          id: 'dropdown',
          path: '/second/example-using-component-slide/dropdown',
          label: 'Dropdown',
          icon: 'fas fa-chevron-down',
        },
        {
          id: 'text-editor',
          path: '/second/example-using-component-slide/text-editor',
          label: 'Text Editor',
          icon: 'fas fa-edit',
        },
        {
          id: 'card-data',
          path: '/second/example-using-component-slide/card-data',
          label: 'Card Data',
          icon: 'fas fa-id-card',
        },
        {
          id: 'trending',
          path: '/second/example-using-component-slide/trending',
          label: 'Trending',
          icon: 'fas fa-fire',
        },
      ],
    },
    {
      id: 'auth',
      path: '/main/auth',
      label: 'Authentication',
      icon: 'fas fa-user',
      children: [
        {
          id: 'login',
          path: '/main/auth/login',
          label: 'Login',
          icon: 'fas fa-sign-in-alt',
        },
        {
          id: 'register',
          path: '/main/auth/register',
          label: 'Register',
          icon: 'fas fa-user-plus',
        },
      ],
    },
    {
      id: 'post',
      path: '/main/post',
      label: 'Posts',
      icon: 'fas fa-file-pen',
    },
  ];
}
