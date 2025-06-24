import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TrendingItem {
  name: string;
  views: number;
}

export interface TrendingItemWithLevel extends TrendingItem {
  level: 'low' | 'medium' | 'high' | 'very-high';
  percentage: number;
}

@Component({
  selector: 'app-trending',
  imports: [CommonModule],
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.scss',
})
export class TrendingComponent implements OnInit {
  @Input() items: TrendingItem[] = [];
  @Input() title: string = 'Trending Tags';
  @Input() maxItems: number = 20;

  processedItems: TrendingItemWithLevel[] = [];

  ngOnInit() {
    this.processItems();
  }

  ngOnChanges() {
    this.processItems();
  }

  // Thêm trackBy function để tối ưu performance
  trackByName(index: number, item: TrendingItemWithLevel): string {
    return item.name;
  }

  private processItems() {
    if (!this.items || this.items.length === 0) {
      this.processedItems = [];
      return;
    }

    // Sắp xếp theo lượng truy cập giảm dần
    const sortedItems = [...this.items]
      .sort((a, b) => b.views - a.views)
      .slice(0, this.maxItems);

    const maxViews = Math.max(...sortedItems.map((item) => item.views));
    const minViews = Math.min(...sortedItems.map((item) => item.views));

    this.processedItems = sortedItems.map((item) => {
      const percentage =
        maxViews === minViews
          ? 100
          : ((item.views - minViews) / (maxViews - minViews)) * 100;

      let level: 'low' | 'medium' | 'high' | 'very-high';

      if (percentage >= 80) {
        level = 'very-high';
      } else if (percentage >= 60) {
        level = 'high';
      } else if (percentage >= 30) {
        level = 'medium';
      } else {
        level = 'low';
      }

      return {
        ...item,
        level,
        percentage: Math.round(percentage),
      };
    });
  }

  formatViews(views: number): string {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  }
}
