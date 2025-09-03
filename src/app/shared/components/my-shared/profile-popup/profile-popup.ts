import { NgClass } from '@angular/common';
import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '../../../utils/stringProcess';
import { ButtonComponent } from '../button/button.component';
import {
  DEFAULT_BG,
  follow,
  SearchUserProfileResponse,
} from '../../../../core/models/user.models';
import { FollowPopup } from './follow-popup/follow-popup.';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.html',
  styleUrls: ['./profile-popup.scss'],
  standalone: true,
  imports: [ButtonComponent, NgClass, FollowPopup],
})
export class ProfilePopupComponent {
  @Input() user!: SearchUserProfileResponse;
  @Input() follower!: follow[];
  @Input() following!: follow[];
  @Input() variant: 'personal' | 'other' | 'popup' = 'popup';
  @Input() onClickEdit?: () => void;
  showFollowPopup = false;
  avatarDefault = avatarUrlDefault;
  backgroundDefault = DEFAULT_BG;

  formatDate(time: Date) {
    return formatDate(time);
  }
  educationOptions = [
    { value: 0, label: 'Không tiết lộ' },
    { value: 1, label: 'Tiểu học' },
    { value: 2, label: 'Trung học cơ sở' },
    { value: 3, label: 'Trung học phổ thông' },
    { value: 4, label: 'Trung cấp' },
    { value: 5, label: 'Cao đẳng' },
    { value: 6, label: 'Đại học' },
    { value: 7, label: 'Cao học / Thạc sĩ' },
    { value: 8, label: 'Tiến sĩ' },
    { value: 9, label: 'Khác' },
  ];

  getEducationLabel(value: number): string {
    return (
      this.educationOptions.find((opt) => opt.value === value)?.label ||
      'Không xác định'
    );
  }
  toggleFollowPopup() {
    this.showFollowPopup = !this.showFollowPopup;
  }
}
