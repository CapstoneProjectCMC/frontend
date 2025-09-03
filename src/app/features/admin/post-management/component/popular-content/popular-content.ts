import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface TagInfo {
  name: string;
  level: number; // 1-5
  count: number;
}

@Component({
  selector: 'app-popular-content',
  standalone: true,
  imports: [NgClass],
  templateUrl: './popular-content.html',
  styleUrls: ['./popular-content.scss'],
})
export class PopularContentComponent {
  @Input() numTags: number = 0;
  @Input() tags: TagInfo[] = [];

  get randomTags(): TagInfo[] {
    if (!this.tags || this.tags.length <= 4) return this.tags;
    // Copy mảng và shuffle
    const shuffled = [...this.tags].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }

  formatCount(count: number): string {
    if (count >= 1_000_000_000)
      return (count / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'b';
    if (count >= 1_000_000)
      return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    if (count >= 1_000)
      return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    return count.toString();
  }
  constructor() {}
}
