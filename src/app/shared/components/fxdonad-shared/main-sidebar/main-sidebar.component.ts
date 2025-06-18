import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarItem } from '../../../../core/models/data-handle';

@Component({
  selector: 'app-main-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss',
})
export class MainSidebarComponent {
  @Input() sidebarItems: SidebarItem[] = [];
  @Input() isCollapsed: boolean = false;

  toggleItem(item: SidebarItem): void {
    if (item.children && item.children.length > 0) {
      item.isExpanded = !item.isExpanded;
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
}
