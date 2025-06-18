# Main Sidebar Component

Component sidebar chính với khả năng nhận data từ component cha và hỗ trợ submenu.

## Tính năng

- ✅ Nhận data từ component cha thông qua Input decorator
- ✅ Hỗ trợ submenu với animation
- ✅ Collapse/Expand sidebar
- ✅ Active state cho menu items
- ✅ Responsive design
- ✅ Smooth animations và transitions
- ✅ Icon support (FontAwesome)
- ✅ Router integration

## Cách sử dụng

### 1. Import component

```typescript
import { MainSidebarComponent, SidebarItem } from './path/to/main-sidebar.component';
```

### 2. Định nghĩa data structure

```typescript
interface SidebarItem {
  id: string;           // Unique identifier
  path: string;         // Router path
  label: string;        // Display text
  icon?: string;        // FontAwesome icon class (optional)
  children?: SidebarItem[]; // Submenu items (optional)
  isActive?: boolean;   // Active state (optional)
  isExpanded?: boolean; // Expanded state for submenu (optional)
}
```

### 3. Sử dụng trong template

```html
<app-main-sidebar 
  [sidebarItems]="yourSidebarData" 
  [isCollapsed]="isSidebarCollapsed">
</app-main-sidebar>
```

### 4. Ví dụ data

```typescript
sidebarData: SidebarItem[] = [
  {
    id: 'home',
    path: '/home',
    label: 'Home',
    icon: 'fas fa-home',
    isActive: true
  },
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    children: [
      {
        id: 'analytics',
        path: '/dashboard/analytics',
        label: 'Analytics',
        icon: 'fas fa-chart-line'
      },
      {
        id: 'reports',
        path: '/dashboard/reports',
        label: 'Reports',
        icon: 'fas fa-file-alt'
      }
    ]
  }
];
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `sidebarItems` | `SidebarItem[]` | `[]` | Array of sidebar menu items |
| `isCollapsed` | `boolean` | `false` | Control sidebar collapse state |

## Methods

| Method | Description |
|--------|-------------|
| `toggleItem(item: SidebarItem)` | Toggle submenu expand/collapse |
| `setActiveItem(item: SidebarItem)` | Set active state for menu item |

## Styling

Component sử dụng SCSS với các class chính:

- `.sidebar` - Container chính
- `.sidebar-header` - Header với toggle button
- `.sidebar-nav` - Navigation container
- `.sidebar-menu` - Menu list
- `.sidebar-item` - Individual menu item
- `.sidebar-link` - Menu link
- `.submenu` - Submenu container
- `.submenu-item` - Submenu item

## Responsive

- Desktop: Full width sidebar (280px)
- Mobile: Full width sidebar
- Collapsed state: 70px width (desktop only)

## Dependencies

- Angular CommonModule
- Angular RouterModule
- FontAwesome (cho icons)

## Demo

Xem file `sidebar-demo.component.ts` để có ví dụ hoàn chỉnh về cách sử dụng component. 