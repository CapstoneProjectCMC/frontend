import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLayoutComponent } from '../../../layouts/layout-components/menu/menu-layout.component';
import { SidebarItem } from '../../../core/models/data-handle';

@Component({
  selector: 'app-menu-demo',
  standalone: true,
  imports: [CommonModule, MenuLayoutComponent],
  template: `
    <div class="demo-container">
      <h2>Menu Layout Demo - Ant Design Style</h2>

      <div class="demo-section">
        <h3>Horizontal Menu với Submenu (Light Theme)</h3>
        <p class="demo-description">
          Click vào menu "Components" để xem submenu dropdown
        </p>
        <app-menu-layout
          [menuItems]="menuItems"
          mode="horizontal"
          theme="light"
        >
        </app-menu-layout>
      </div>

      <div class="demo-section">
        <h3>Horizontal Menu với Submenu (Dark Theme)</h3>
        <p class="demo-description">
          Click vào menu "Authentication" để xem submenu dropdown
        </p>
        <app-menu-layout [menuItems]="menuItems" mode="horizontal" theme="dark">
        </app-menu-layout>
      </div>

      <div class="demo-section">
        <h3>Vertical Menu với Submenu</h3>
        <p class="demo-description">
          Click vào menu items để xem submenu expand/collapse
        </p>
        <div class="vertical-menu-container">
          <app-menu-layout
            [menuItems]="menuItems"
            mode="vertical"
            theme="light"
          >
          </app-menu-layout>
        </div>
      </div>

      <div class="demo-section">
        <h3>Menu Items Structure</h3>
        <div class="structure-info">
          <h4>Menu Items có Children:</h4>
          <ul>
            <li><strong>Components</strong> - Có 6 submenu items</li>
            <li><strong>Authentication</strong> - Có 2 submenu items</li>
          </ul>
          <h4>Menu Items không có Children:</h4>
          <ul>
            <li><strong>Home</strong> - Menu item đơn giản</li>
            <li><strong>Dashboard</strong> - Menu item đơn giản</li>
            <li><strong>Posts</strong> - Menu item đơn giản</li>
            <li><strong>Disabled Item</strong> - Menu item bị vô hiệu hóa</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      h2 {
        color: var(--text-color);
        margin-bottom: 30px;
        text-align: center;
      }

      .demo-section {
        margin-bottom: 40px;
        padding: 20px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--background-color);
      }

      h3 {
        color: var(--text-color);
        margin-bottom: 10px;
        font-size: 18px;
      }

      .demo-description {
        color: var(--text-color);
        margin-bottom: 15px;
        font-style: italic;
        font-size: 14px;
      }

      .vertical-menu-container {
        width: 250px;
        height: 400px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
      }

      .structure-info {
        background: rgba(24, 144, 255, 0.05);
        padding: 15px;
        border-radius: 6px;
        border-left: 4px solid var(--primary-color);
      }

      .structure-info h4 {
        color: var(--text-color);
        margin: 10px 0 5px 0;
        font-size: 16px;
      }

      .structure-info ul {
        margin: 5px 0;
        padding-left: 20px;
      }

      .structure-info li {
        color: var(--text-color);
        margin: 3px 0;
        font-size: 14px;
      }

      .structure-info strong {
        color: var(--primary-color);
      }
    `,
  ],
})
export class MenuDemoComponent {
  menuItems: SidebarItem[] = [
    {
      id: 'home',
      path: '/second/example-using-component-slide/app-menu-layout',
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
    {
      id: 'disabled',
      path: '#',
      label: 'Disabled Item',
      icon: 'fas fa-ban',
      disabled: true,
    },
  ];
}
