# Menu Layout Component

Component menu layout ngang theo thiết kế Ant Design với khả năng tùy chỉnh theme và mode, hỗ trợ submenu dropdown, **tự động cập nhật theme** và **hover functionality**.

## Tính năng

- ✅ Menu ngang (horizontal) và dọc (vertical)
- ✅ **Submenu dropdown** cho menu items có children
- ✅ **Auto theme switching** - Tự động cập nhật khi theme thay đổi
- ✅ **Hover functionality** - Tự động mở/đóng submenu khi hover
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
<!-- Menu sẽ tự động cập nhật theme và hỗ trợ hover -->
<app-menu-layout 
  [menuItems]="menuItems" 
  mode="horizontal">
</app-menu-layout>
```

## Hover Functionality

### Cách hoạt động:

#### **Horizontal Mode:**
- **Hover vào menu item** → Submenu mở ngay lập tức
- **Hover ra khỏi menu item** → Submenu đóng sau 150ms delay
- **Hover vào submenu** → Submenu vẫn mở
- **Hover ra khỏi submenu** → Submenu đóng sau 100ms delay

#### **Vertical Mode:**
- **Click vào menu item** → Submenu expand/collapse
- **Hover không có tác dụng** → Chỉ dùng click

### Implementation Details:

```typescript
// Hover events for menu items
onMouseEnter(item: SidebarItem): void {
  if (this.hasChildren(item) && this.mode === 'horizontal') {
    this.expandedItems.add(item.id);
  }
}

onMouseLeave(item: SidebarItem): void {
  if (this.hasChildren(item) && this.mode === 'horizontal') {
    this.hoverTimeout = setTimeout(() => {
      this.expandedItems.delete(item.id);
    }, 150); // 150ms delay
  }
}

// Hover events for submenu
onSubmenuMouseEnter(item: SidebarItem): void {
  if (this.mode === 'horizontal') {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  }
}

onSubmenuMouseLeave(item: SidebarItem): void {
  if (this.mode === 'horizontal') {
    this.hoverTimeout = setTimeout(() => {
      this.expandedItems.delete(item.id);
    }, 100); // 100ms delay
  }
}
```

### Features:
- ✅ **Smooth animations** với cubic-bezier easing
- ✅ **Delay mechanism** để tránh submenu đóng quá nhanh
- ✅ **Pointer events management** cho submenu
- ✅ **Memory leak prevention** với timeout cleanup
- ✅ **Mode-specific behavior** (hover chỉ hoạt động ở horizontal mode)

## Theme Switching

### Tự động cập nhật theme:
Component tự động lắng nghe thay đổi theme từ `ThemeService` và cập nhật giao diện ngay lập tức.

```typescript
// Component tự động subscribe to theme changes
this.themeSubscription = this.themeService.themeChanged$.subscribe(
  (newTheme) => {
    this.theme = newTheme;
  }
);
```

### Cách hoạt động:
1. Component inject `ThemeService` trong constructor
2. Subscribe to `themeChanged$` observable trong `ngOnInit`
3. Tự động cập nhật `theme` property khi có thay đổi
4. Template binding `[class.ant-menu-light]="theme === 'light'"` sẽ trigger re-render
5. Cleanup subscription trong `ngOnDestroy`

### Test theme switching:
Sử dụng component test để kiểm tra theme switching:

```typescript
// Trong component khác
constructor(private themeService: ThemeService) {}

toggleTheme() {
  this.themeService.toggleTheme();
}
```

## Submenu Functionality

### Cách hoạt động:
- **Horizontal Mode**: Hover hoặc click vào menu item có children sẽ hiển thị dropdown submenu
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
| `mode` | `'horizontal' \| 'vertical'` | `'horizontal'` | Mode hiển thị của menu |

**Lưu ý**: `theme` không còn là `@Input()` vì component tự động lấy từ `ThemeService`

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
- Smooth fade in/out animation với cubic-bezier
- Hover functionality với delay mechanism

### Vertical Mode:
- Submenu hiển thị inline dưới parent item
- Indent với padding-left
- Expand/collapse animation
- Click-only functionality

## Responsive Design

- **Desktop**: Full submenu dropdown functionality với hover
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

- Fade in/out animation cho submenu với cubic-bezier easing
- Smooth hover transitions
- Arrow rotation cho items có children
- Transform effects trên hover
- Expand/collapse animation cho vertical mode
- Delay mechanism cho hover events

## Accessibility

- Keyboard navigation support
- Focus indicators
- ARIA attributes
- Screen reader friendly
- Proper tab order cho submenu items
- Hover delay để tránh accidental triggers

## Dependencies

- Angular CommonModule
- Angular RouterModule
- FontAwesome (cho icons)
- SCSS variables từ theme system
- **ThemeService** - Để lắng nghe thay đổi theme

## Demo

Xem file `menu-hover-demo.component.ts` để có ví dụ hoàn chỉnh về cách test hover functionality và theme switching.

## Integration với Layout

Menu layout này được thiết kế để đặt dưới header trong layout chính:

```html
<app-header></app-header>
<app-menu-layout [menuItems]="menuItems"></app-menu-layout>
<router-outlet></router-outlet>
```

## Troubleshooting

### Hover không hoạt động:
1. Đảm bảo đang sử dụng `mode="horizontal"`
2. Kiểm tra console để xem có lỗi JavaScript không
3. Đảm bảo menu item có property `children`
4. Kiểm tra CSS pointer-events có bị disable không

### Submenu đóng quá nhanh:
1. Điều chỉnh delay time trong `onMouseLeave` và `onSubmenuMouseLeave`
2. Kiểm tra hover area có bị overlap không
3. Đảm bảo submenu có đủ space để hover

### Component không cập nhật theme:
1. Đảm bảo `ThemeService` được inject đúng cách
2. Kiểm tra console để xem có lỗi subscription không
3. Đảm bảo `ThemeService.themeChanged$` emit giá trị mới
4. Kiểm tra CSS variables có được cập nhật không

### Submenu không hiển thị:
1. Kiểm tra xem menu item có property `children` không
2. Đảm bảo `children` là array và có ít nhất 1 item
3. Kiểm tra console để xem có lỗi JavaScript không

### Submenu không đóng:
1. Click vào submenu item sẽ tự động đóng submenu
2. Click vào menu item khác cũng sẽ đóng submenu hiện tại
3. Submenu sẽ đóng khi navigate đến route khác
4. Hover ra khỏi menu area sẽ đóng submenu (horizontal mode) 