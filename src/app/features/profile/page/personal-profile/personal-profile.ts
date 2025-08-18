import { NgIf, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ProfilePopupComponent } from '../../../../shared/components/my-shared/profile-popup/profile-popup';
import {
  DecodedJwtPayload,
  EnumType,
} from '../../../../core/models/data-handle';
import { getUserInfoFromLocalStorage } from '../../../../shared/utils/userInfo';
import { decodeJWT } from '../../../../shared/utils/stringProcess';
import { ProfileService } from '../../../../core/services/api-service/profile.service';
import { follow, User } from '../../../../core/models/user.models';
import {
  openModalNotification,
  sendNotification,
} from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import { clearLoading } from '../../../../shared/store/loading-state/loading.action';
import { UpdateProfileComponent } from '../../component/updateform/profile-popup/update-profile';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import {
  CardExcercise,
  CardExcerciseComponent,
} from '../../../../shared/components/fxdonad-shared/card-excercise/card-excercise.component';
import { ExerciseItem } from '../../../../core/models/exercise.model';
import { mapExerciseResToCardUI } from '../../../../shared/utils/mapData';
import { SkeletonLoadingComponent } from '../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { ExerciseModalComponent } from '../../../excercise/exercise-modal/create-new-exercise/exercise-modal.component';
import { Title } from '@angular/platform-browser';
import { ButtonComponent } from '../../../../shared/components/my-shared/button/button.component';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.html',
  styleUrls: ['./personal-profile.scss'],
  imports: [
    ProfilePopupComponent,
    NgIf,
    NgClass,
    NgFor,
    UpdateProfileComponent,
    SkeletonLoadingComponent,
    CardExcerciseComponent,
    ButtonComponent,
  ],
  standalone: true,
})
export class PersonalProfileComponent {
  user: User = {
    userId: '',
    username: '',
    email: '',
    firstName: 'Không',
    lastName: 'rõ',
    dob: '00-00-0000',
    bio: 'Chưa có tiểu sử',
    gender: true,
    displayName: 'Chưa có tên',
    education: 0,
    links: [],
    city: '',
    avatarUrl:
      'https://i.pinimg.com/736x/29/d1/21/29d12118407b97927c8d3b07400c365a.jpg',
    backgroundUrl:
      'https://i.pinimg.com/736x/98/88/fa/9888fa08e94d226a1f11cb1f174a6a98.jpg',
    createdAt: '',
  };
  isLoading = false;
  isLoadingMore = false;
  openedUser: User | null = null;
  isClosing = false;
  fakenumber = 50;
  userId: string | undefined = undefined;
  listExercise: CardExcercise[] = [];

  pageIndex: number = 1;
  itemsPerPage: number = 2;
  sortBy: EnumType['sort'] = 'CREATED_AT';
  asc: boolean = false;
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
  fakeNotification = [
    {
      id: '001',
      link: 'http://localhost:4200/',
      title: 'Kết quả cuộc thi 01092',
    },
    {
      id: '002',
      link: 'http://localhost:4200/',
      title: 'Bài tập được chấm điểm2',
    },
    {
      id: '003',
      link: 'http://localhost:4200/',
      title: 'Bài tập sắp hết hạn',
    },
  ];
  followerList: follow[] = [
    {
      userId: '1',
      displayName: 'Trần Thị B',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
      firstName: 'Nam',
      lastName: 'Mạnh',
    },
    {
      userId: '2',
      displayName: 'Lê Văn C',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      firstName: 'Bà',
      lastName: 'Nữ',
    },
  ];

  followingList: follow[] = [
    {
      userId: '3',
      displayName: 'Phạm Thị D',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
      firstName: 'Không',
      lastName: 'Ngộ',
    },
    {
      userId: '4',
      displayName: 'Hoàng Văn E',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      firstName: 'Phan',
      lastName: 'Quân',
    },
    {
      userId: '5',
      displayName: 'Ngô Thị F',
      avatarUrl: 'https://i.pravatar.cc/150?img=6',
      firstName: 'Phan',
      lastName: 'Hải',
    },
  ];
  constructor(
    private profileService: ProfileService,
    private store: Store,
    private exerciseService: ExerciseService
  ) {
    const token = localStorage.getItem('token');

    if (token) {
      this.userId = decodeJWT(token)?.payload.userId;
    }
  }

  private mapExerciseResToCardDataUI(data: ExerciseItem[]): CardExcercise[] {
    return data.map((info) => mapExerciseResToCardUI(info));
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.profileService.getMyProfile().subscribe({
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
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.exerciseService
      .getAllExercise(this.pageIndex, this.itemsPerPage, this.sortBy, this.asc)
      .subscribe({
        next: (res) => {
          const data = this.mapExerciseResToCardDataUI(res.result.data);
          this.listExercise = data;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          // this.store.dispatch(clearLoading());
        },
      });
  }

  // chửa dùng
  openModalConfirm() {
    openModalNotification(
      this.store,
      'Xác nhận nộp bài',
      'Bạn có chắc chắn hoàn thành bài thi?',
      'Đồng ý',
      'Soát lại'
    );
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
