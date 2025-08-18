import { Component, Input } from '@angular/core';
import { follow } from '../../../../../core/models/user.models';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-follow-popup',
  templateUrl: './follow-popup.html',
  styleUrls: ['./follow-popup.scss'],
  standalone: true,
  imports: [NgFor, NgIf],
})
export class FollowPopup {
  @Input() follower!: follow[];
  @Input() following!: follow[];
  activeTab: 'followers' | 'following' = 'followers';

  unfollow(user: follow) {
    // Xử lý tượng trưng: xóa khỏi mảng following
    this.following = this.following.filter((u) => u.userId !== user.userId);
    console.log(`Đã hủy theo dõi ${user}`);
  }
}
