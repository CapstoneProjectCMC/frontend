import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PostCardInfo } from '../../../../../core/models/post.models';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';

export interface TagInfo {
  name: string;
  level: number; // 1-5
  count: number;
}

@Component({
  selector: 'app-popular-post',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './popular-post.html',
  styleUrls: ['./popular-post.scss'],
})
export class PopularPostComponent {
  @Input() ListPost: PostCardInfo[] = [];

  get topPosts(): PostCardInfo[] {
    return this.ListPost.slice(0, 2);
  }
  handleAdd = () => {};
  formatCount(count: number): string {
    if (count >= 1_000_000_000)
      return (count / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'b';
    if (count >= 1_000_000)
      return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    if (count >= 1_000)
      return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    return count.toString();
  }
  timeAgo(dateString: string | Date): string {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
    if (diff < 31104000) return `${Math.floor(diff / 2592000)} tháng trước`;
    return `${Math.floor(diff / 31104000)} năm trước`;
  }
  constructor() {}
}
