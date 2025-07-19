import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { SidebarItem } from '../../../core/models/data-handle';
import { ThemeService } from '../../../styles/theme-service/theme.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu-layout',
  templateUrl: './menu-layout.component.html',
  styleUrls: ['./menu-layout.component.scss'],
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class MenuLayoutComponent implements OnInit, OnDestroy {
  @Input() menuItems: SidebarItem[] = [];
  @Input() mode: 'horizontal' | 'vertical' = 'horizontal';

  activeItem: string = '';
  theme: 'light' | 'dark' = 'light';
  expandedItems: Set<string> = new Set();
  private themeSubscription?: Subscription;
  private hoverTimeout?: any;
  submenuState: { [key: string]: 'open' | 'close' } = {};

  isMobileMenuOpen: boolean = false;
  submenuPopoverPosition: {
    [key: string]: { top: number; left: number; width: number };
  } = {};
  private resizeListener: (() => void) | undefined;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private eRef: ElementRef
  ) {
    this.handleResize();
  }

  ngOnInit() {
    // Đồng bộ activeItem với url hiện tại khi khởi tạo
    this.updateActiveItemByUrl(this.router.url);

    // Lắng nghe sự kiện chuyển route để cập nhật activeItem
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateActiveItemByUrl(event.urlAfterRedirects);
        this.handleResize();
      });

    // Subscribe to theme changes
    this.theme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.themeChanged$.subscribe(
      (newTheme) => {
        this.theme = newTheme;
      }
    );

    this.resizeListener = () => {
      this.handleResize();
    };
    window.addEventListener('resize', this.resizeListener);
  }

  /**
   * Cập nhật activeItem dựa trên url hiện tại, kiểm tra cả menu con
   */
  updateActiveItemByUrl(url: string) {
    // Tìm item có path khớp với url hiện tại
    const found = this.menuItems.find((item) => item.path === url);
    if (found) {
      this.activeItem = found.id;
      return;
    }
    // Kiểm tra children (submenu)
    for (const item of this.menuItems) {
      if (item.children) {
        const child = item.children.find((child) => child.path === url);
        if (child) {
          this.activeItem = child.id;
          return;
        }
      }
    }
    // Nếu không tìm thấy, bỏ active
    this.activeItem = '';
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    // Clean up timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  handleResize() {
    if (!this.isMobileView && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu(event: Event) {
    event.stopPropagation();
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  setActiveItem(item: SidebarItem): void {
    this.activeItem = item.id;
  }

  isActive(item: SidebarItem): boolean {
    return this.activeItem === item.id;
  }

  hasChildren(item: SidebarItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  toggleSubmenu(item: SidebarItem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.hasChildren(item)) {
      const label = item.id;
      if (this.submenuState[label] === 'open') {
        this.submenuState[label] = 'close';
        if (this.isMobileView) {
          this.submenuPopoverPosition[label] = { top: 0, left: 0, width: 0 };
        }
      } else {
        Object.keys(this.submenuState).forEach((key) => {
          this.submenuState[key] = 'close';
        });
        this.submenuState[label] = 'open';
        if (this.isMobileView) {
          const liElem = (event.currentTarget as HTMLElement).closest('li');
          if (liElem) {
            const rect = liElem.getBoundingClientRect();
            const submenuWidth = window.innerWidth * 0.4; // 40vw
            const left = rect.left + (rect.width - submenuWidth) / 2;
            this.submenuPopoverPosition[label] = {
              top: rect.bottom,
              left,
              width: submenuWidth,
            };
          }
        }
      }
    }
  }

  isExpanded(item: SidebarItem): boolean {
    return this.submenuState[item.id] === 'open';
  }

  onSubmenuItemClick(childItem: SidebarItem): void {
    this.setActiveItem(childItem);
    // Đóng tất cả submenu khi click vào submenu item
    Object.keys(this.submenuState).forEach((key) => {
      this.submenuState[key] = 'close';
    });
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      // Đóng tất cả submenu
      Object.keys(this.submenuState).forEach((label) => {
        if (this.submenuState[label] === 'open') {
          this.submenuState[label] = 'close';
        }
      });
      // Đóng menu chính nếu đang ở mobile
      if (this.isMobileView && this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
      }
    }
  }

  // Hover events for submenu
  onMouseEnter(item: SidebarItem): void {
    // if (this.hasChildren(item) && this.mode === 'horizontal') {
    //   // Clear any existing timeout
    //   if (this.hoverTimeout) {
    //     clearTimeout(this.hoverTimeout);
    //   }
    //   // Open submenu immediately
    //   this.expandedItems.add(item.id);
    // }
  }

  onMouseLeave(item: SidebarItem): void {
    // if (this.hasChildren(item) && this.mode === 'horizontal') {
    //   // Add delay before closing to allow moving mouse to submenu
    //   this.hoverTimeout = setTimeout(() => {
    //     this.expandedItems.delete(item.id);
    //   }, 150); // 150ms delay
    // }
  }

  // Hover events for submenu container
  onSubmenuMouseEnter(item: SidebarItem): void {
    // if (this.mode === 'horizontal') {
    //   // Clear timeout when hovering over submenu
    //   if (this.hoverTimeout) {
    //     clearTimeout(this.hoverTimeout);
    //   }
    // }
  }

  onSubmenuMouseLeave(item: SidebarItem): void {
    // if (this.mode === 'horizontal') {
    //   // Close submenu when leaving submenu area
    //   this.hoverTimeout = setTimeout(() => {
    //     this.expandedItems.delete(item.id);
    //   }, 100); // 100ms delay
    // }
  }

  get isMobileView(): boolean {
    return window.innerWidth <= 770;
  }
}
