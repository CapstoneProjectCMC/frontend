import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarItem } from '../../../core/models/data-handle';
import { ThemeService } from '../../../styles/theme-service/theme.service';
import { Subscription } from 'rxjs';

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

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Set first item as active by default
    if (this.menuItems.length > 0) {
      this.activeItem = this.menuItems[0].id;
    }

    // Subscribe to theme changes
    this.theme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.themeChanged$.subscribe(
      (newTheme) => {
        this.theme = newTheme;
      }
    );
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
      if (this.expandedItems.has(item.id)) {
        this.expandedItems.delete(item.id);
      } else {
        this.expandedItems.add(item.id);
      }
    }
  }

  isExpanded(item: SidebarItem): boolean {
    return this.expandedItems.has(item.id);
  }

  onSubmenuItemClick(childItem: SidebarItem): void {
    this.setActiveItem(childItem);
    // Close all submenus when a submenu item is clicked
    this.expandedItems.clear();
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
}
