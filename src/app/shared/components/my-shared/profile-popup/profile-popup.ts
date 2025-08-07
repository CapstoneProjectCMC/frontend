import { NgClass, NgFor, NgIf } from '@angular/common';
import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '../../../utils/stringProcess';
import { ButtonComponent } from '../button/button.component';
import { User } from '../../../../core/models/user.models';

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.html',
  styleUrls: ['./profile-popup.scss'],
  standalone: true,
  imports: [NgFor, ButtonComponent, NgClass, NgIf],
})
export class ProfilePopupComponent {
  @Input() user!: User;
  @Input() variant: 'personal' | 'other' | 'popup' = 'popup';
  @Input() onClickEdit?: () => void;

  formatDate(time: Date) {
    return formatDate(time);
  }
}
