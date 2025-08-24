import { NgClass, NgFor, NgIf } from '@angular/common';
import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '../../../utils/stringProcess';
import { ButtonComponent } from '../button/button.component';
import {
  follow,
  SearchUserProfileResponse,
} from '../../../../core/models/user.models';
import { FollowPopup } from './follow-popup/follow-popup.';

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.html',
  styleUrls: ['./profile-popup.scss'],
  standalone: true,
  imports: [NgFor, ButtonComponent, NgClass, NgIf, FollowPopup],
})
export class ProfilePopupComponent {
  @Input() user!: SearchUserProfileResponse;
  @Input() follower!: follow[];
  @Input() following!: follow[];
  @Input() variant: 'personal' | 'other' | 'popup' = 'popup';
  @Input() onClickEdit?: () => void;
  showFollowPopup = false;
  formatDate(time: Date) {
    return formatDate(time);
  }
  toggleFollowPopup() {
    this.showFollowPopup = !this.showFollowPopup;
  }
}
