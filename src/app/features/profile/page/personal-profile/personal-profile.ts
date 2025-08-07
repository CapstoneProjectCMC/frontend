import { NgIf, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ProfilePopupComponent } from '../../../../shared/components/my-shared/profile-popup/profile-popup';
import { DecodedJwtPayload } from '../../../../core/models/data-handle';
import { getUserInfoFromLocalStorage } from '../../../../shared/utils/userInfo';
import { decodeJWT } from '../../../../shared/utils/stringProcess';
import { ProfileService } from '../../../../core/services/api-service/profile.service';
import { User } from '../../../../core/models/user.models';
import { sendNotification } from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import { clearLoading } from '../../../../shared/store/loading-state/loading.action';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.html',
  styleUrls: ['./personal-profile.scss'],
  imports: [ProfilePopupComponent, NgIf, NgClass, NgFor],
  standalone: true,
})
export class PersonalProfileComponent {
  user!: User;
  isLoading = false;
  isLoadingMore = false;
  openedUser: User | null = null;
  isClosing = false;
  fakenumber = 50;
  userId: string | undefined = undefined;
  fakeCompetition = [
    {
      name: 'Competition 1',
      status: 'ongoing',
    },
    {
      name: 'Competition 2',
      status: 'upcoming',
    },
    {
      name: 'Competition 3',
      status: 'completed',
    },
  ];

  constructor(private profileService: ProfileService, private store: Store) {
    // Mock user data for demonstration purposes
    // this.user = {
    //   id: '12345',
    //   userId: 'user123',

    //   avatarUrl:
    //     'https://i.pinimg.com/736x/3e/a6/79/3ea679dfac387c922dcecdd4f212c79d.jpg',
    //   backgroundUrl:
    //     'https://i.pinimg.com/736x/98/88/fa/9888fa08e94d226a1f11cb1f174a6a98.jpg',
    //   displayName: 'Oikawa Tooru',
    //   dob: '1990-01-01',
    //   gender: true,
    //   links: ['https://example.com'],
    //   bio: 'This is a sample bio.',
    //   firstName: 'John',
    //   lastName: 'Doe',
    //   education: 9,
    // };
    // this.user = { ...this.user };
    const token = localStorage.getItem('token');

    if (token) {
      this.userId = decodeJWT(token)?.payload.userId;
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.profileService.getProfilebyId(this.userId || '').subscribe({
      next: (res) => {
        this.user = res.result;

        sendNotification(
          this.store,
          'Thành công',
          'Lấy hồ sơ người dùng thành công',
          'success'
        );
        this.isLoading = false;
        this.store.dispatch(clearLoading());
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.store.dispatch(clearLoading());
      },
    });
  }
  onDisplayNameClick(row: User) {
    this.openedUser = row;
    this.isClosing = false;
  }
  closeProfilePopup() {
    this.isClosing = true;
    setTimeout(() => {
      this.openedUser = null;
      this.isClosing = false;
    }, 200); // Thời gian đúng với animation
  }
}
