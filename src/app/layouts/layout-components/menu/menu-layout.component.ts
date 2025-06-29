import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarItem } from '../../../core/models/data-handle';

@Component({
  selector: 'app-menu-layout',
  templateUrl: './menu-layout.component.html',
  styleUrls: ['./menu-layout.component.scss'],
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class MenuLayoutComponent implements OnInit {
  @Input() menuItems: SidebarItem[] = [];
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() mode: 'horizontal' | 'vertical' = 'horizontal';

  activeItem: string = '';
  expandedItems: Set<string> = new Set();

  ngOnInit() {
    // Set first item as active by default
    if (this.menuItems.length > 0) {
      this.activeItem = this.menuItems[0].id;
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
}
