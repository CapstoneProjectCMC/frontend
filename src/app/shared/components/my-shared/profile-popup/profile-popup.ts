import { NgClass, NgFor, NgIf } from '@angular/common';
import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '../../../utils/stringProcess';

export interface UserInfor {
  avatarUrl: string;
  backgroundUrl: string;
  displayName: string;
  dob: Date;
  role: number;
  status: number;
  org: string;
  links: { type: string; url: string }[];
  followers: number;
  following: number;
  bio: string;
  firstname: string;
  lastname: string;
  education: string;
  gender: string;
}

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.html',
  styleUrls: ['./profile-popup.scss'],
  standalone: true,
  imports: [NgFor],
})
export class ProfilePopupComponent {
  @Input() user!: UserInfor;
  formatDate(time: Date) {
    return formatDate(time);
  }
}
