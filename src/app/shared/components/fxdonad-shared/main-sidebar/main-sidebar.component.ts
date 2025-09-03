import { Component, Input } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SidebarItem } from '../../../../core/models/data-handle';

@Component({
  selector: 'app-main-sidebar',
  imports: [RouterModule],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss',
})
export class MainSidebarComponent {
  @Input() sidebarItems: SidebarItem[] = [];
  @Input() isCollapsed: boolean = true;

  toggleItem(item: SidebarItem): void {
    if (this.isCollapsed && !item.isExpanded) {
      this.isCollapsed = !this.isCollapsed;
    }

    if (item.children && item.children.length > 0) {
      if (this.isCollapsed && item.isExpanded) {
        this.isCollapsed = !this.isCollapsed;
      } else {
        item.isExpanded = !item.isExpanded;
      }

      if (item.isExpanded && item.children) {
        // Add animation for submenu items when opening
        this.animateSubmenuItems(item.children);
      } else if (!item.isExpanded && item.children) {
        // Reset visibility when closing
        this.resetSubmenuItemsVisibility(item.children);
      }
    }
  }

  setActiveItem(item: SidebarItem): void {
    // Reset all items
    this.resetActiveItems(this.sidebarItems);
    // Set current item as active
    item.isActive = true;
  }

  private resetActiveItems(items: SidebarItem[]): void {
    items.forEach((item) => {
      item.isActive = false;
      if (item.children) {
        this.resetActiveItems(item.children);
      }
    });
  }

  private animateSubmenuItems(children: SidebarItem[]): void {
    children.forEach((child, index) => {
      // Add delay for staggered animation
      setTimeout(() => {
        child.isVisible = true;
      }, index * 50); // 50ms delay between each item
    });
  }

  private resetSubmenuItemsVisibility(children: SidebarItem[]): void {
    children.forEach((child) => {
      child.isVisible = false;
    });
  }
}
