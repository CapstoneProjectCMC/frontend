# Menu Layout Component

Component menu layout ngang theo thiết kế Ant Design với khả năng tùy chỉnh theme và mode, hỗ trợ submenu dropdown.

## Tính năng

- ✅ Menu ngang (horizontal) và dọc (vertical)
- ✅ **Submenu dropdown** cho menu items có children
- ✅ Light theme và Dark theme
- ✅ Hỗ trợ icons (FontAwesome)
- ✅ Active state và hover effects
- ✅ Responsive design
- ✅ Disabled state cho menu items
- ✅ Smooth animations và transitions
- ✅ Router integration
- ✅ Accessibility support

## Cách sử dụng

### 1. Import component

```typescript
import { MenuLayoutComponent } from './path/to/menu-layout.component';
```

### 2. Định nghĩa menu items với submenu

```typescript
import { SidebarItem } from '../../../core/models/data-handle';

const menuItems: SidebarItem[] = [
  {
    id: 'home',
    path: '/home',
    label: 'Home',
    icon: 'fas fa-home',
    isActive: true
  },
  {
    id: 'components',
    path: '/components',
    label: 'Components',
    icon: 'fas fa-code',
    children: [
      {
        id: 'code-editor',
        path: '/components/code-editor',
        label: 'Code Editor',
        icon: 'fas fa-file-code'
      },
      {
        id: 'input-button',
        path: '/components/input-button',
        label: 'Input Button',
        icon: 'fas fa-keyboard'
      }
    ]
  }
];
```

### 3. Sử dụng trong template

```html
<!-- Horizontal Menu với Submenu -->
<app-menu-layout 
  [menuItems]="menuItems" 
  mode="horizontal" 
  theme="light">
</app-menu-layout>

<!-- Vertical Menu với Submenu -->
<app-menu-layout 
  [menuItems]="menuItems" 
  mode="vertical" 
  theme="light">
</app-menu-layout>
```

## Submenu Functionality

### Cách hoạt động:
- **Horizontal Mode**: Click vào menu item có children sẽ hiển thị dropdown submenu
- **Vertical Mode**: Click vào menu item có children sẽ expand/collapse submenu inline
- **Auto Close**: Submenu sẽ tự động đóng khi click vào submenu item khác

### Visual Indicators:
- Menu items có children sẽ có mũi tên (chevron) bên cạnh
- Mũi tên sẽ xoay khi submenu được mở
- Menu item parent sẽ có background highlight khi submenu mở

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `menuItems` | `SidebarItem[]` | `[]` | Array của menu items |
| `theme` | `'light' \| 'dark'` | `'light'` | Theme của menu |
| `mode` | `'horizontal' \| 'vertical'` | `'horizontal'` | Mode hiển thị của menu |

## SidebarItem Interface

```typescript
interface SidebarItem {
  id: string;           // Unique identifier
  path: string;         // Router path
  label: string;        // Display text
  icon?: string;        // FontAwesome icon class (optional)
  children?: SidebarItem[]; // Submenu items (optional)
  isActive?: boolean;   // Active state (optional)
  isExpanded?: boolean; // Expanded state for submenu (optional)
  disabled?: boolean;   // Disabled state (optional)
}
```

## Styling

Component sử dụng SCSS với các class chính:

- `.ant-menu` - Container chính
- `.ant-menu-horizontal` - Horizontal mode
- `.ant-menu-vertical` - Vertical mode
- `.ant-menu-light` - Light theme
- `.ant-menu-dark` - Dark theme
- `.ant-menu-item` - Individual menu item
- `.ant-menu-item-selected` - Selected state
- `.ant-menu-item-disabled` - Disabled state
- `.ant-submenu` - Submenu dropdown container
- `.ant-submenu-item` - Submenu item
- `.ant-submenu-open` - Open submenu state

## Submenu Behavior

### Horizontal Mode:
- Submenu hiển thị dưới dạng dropdown
- Position: absolute, top: 100%
- Box shadow và border radius
- Smooth fade in/out animation

### Vertical Mode:
- Submenu hiển thị inline dưới parent item
- Indent với padding-left
- Expand/collapse animation

## Responsive Design

- **Desktop**: Full submenu dropdown functionality
- **Tablet (768px)**: Adjusted submenu positioning
- **Mobile (480px)**: Submenu hiển thị inline cho cả horizontal mode

## Themes

### Light Theme
- Background: White
- Text: Dark gray
- Hover: Light blue background
- Selected: Blue text với blue underline
- Submenu: White background với shadow

### Dark Theme
- Background: Dark blue (#001529)
- Text: Light gray
- Hover: Blue background
- Selected: White text với blue background
- Submenu: Dark background với border

## Animations

- Fade in/out animation cho submenu
- Smooth hover transitions
- Arrow rotation cho items có children
- Transform effects trên hover
- Expand/collapse animation cho vertical mode

## Accessibility

- Keyboard navigation support
- Focus indicators
- ARIA attributes
- Screen reader friendly
- Proper tab order cho submenu items

## Dependencies

- Angular CommonModule
- Angular RouterModule
- FontAwesome (cho icons)
- SCSS variables từ theme system

## Demo

Xem file `menu-demo.component.ts` để có ví dụ hoàn chỉnh về cách sử dụng component với submenu functionality.

## Integration với Layout

Menu layout này được thiết kế để đặt dưới header trong layout chính:

```html
<app-header></app-header>
<app-menu-layout [menuItems]="menuItems"></app-menu-layout>
<router-outlet></router-outlet>
```

## Troubleshooting

### Submenu không hiển thị:
1. Kiểm tra xem menu item có property `children` không
2. Đảm bảo `children` là array và có ít nhất 1 item
3. Kiểm tra console để xem có lỗi JavaScript không

### Submenu không đóng:
1. Click vào submenu item sẽ tự động đóng submenu
2. Click vào menu item khác cũng sẽ đóng submenu hiện tại
3. Submenu sẽ đóng khi navigate đến route khác 