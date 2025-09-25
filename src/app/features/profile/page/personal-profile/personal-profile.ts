import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ProfilePopupComponent } from '../../../../shared/components/my-shared/profile-popup/profile-popup';
import { EnumType } from '../../../../core/models/data-handle';
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
import {
  ExerciseItem,
  ExerciseSave,
  MyAssignExerciseResponse,
  MySubmissionsHistoryResponse,
} from '../../../../core/models/exercise.model';
import { mapExerciseResToCardUI } from '../../../../shared/utils/mapData';
import { SkeletonLoadingComponent } from '../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { ButtonComponent } from '../../../../shared/components/my-shared/button/button.component';
import { lottieOptions2 } from '../../../../core/constants/value.constant';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LottieComponent } from 'ngx-lottie';
@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.html',
  styleUrls: ['./personal-profile.scss'],
  imports: [
    ProfilePopupComponent,
    NgClass,
    UpdateProfileComponent,
    SkeletonLoadingComponent,
    LottieComponent,
    // ButtonComponent,
    CommonModule,
  ],
  standalone: true,
})
export class PersonalProfileComponent {
  user: User = {
    userId: '',
    username: '',
    active: true,
    roles: [''],
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
  isLoadingExercises = false;
  isLoadingMore = false;
  openedUser: User | null = null;
  isClosing = false;
  fakenumber = 50000000000000000;
  userId: string | undefined = undefined;
  listExercise: CardExcercise[] = [];
  assignments: MyAssignExerciseResponse[] = [];
  totalAssignments: number = 0;
  totalAssignmentsDisplay: string = '0';
  submissions: MySubmissionsHistoryResponse[] | [] = [];
  totalSubmissions: number = 0;
  passedSubmissions: number = 0;

  totalSubmissionsDisplay: string = '0';
  passedSubmissionsDisplay: string = '0';
  pageIndex: number = 1;
  itemsPerPage: number = 2;
  sortBy: EnumType['sort'] = 'CREATED_AT';
  asc: boolean = false;
  exercises: ExerciseSave[] = [];
  page = 1;
  size = 10;
  totalPages = 1;
  lottieOptions = lottieOptions2;
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
    private exerciseService: ExerciseService,
    private router: Router
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
    this.fetchUserData();
    this.fetchData();
    this.fetchQuizSubmitted();
    this.fetchMyAssignExercise();
    this.loadExercises();
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
  fetchUserData() {
    this.profileService.getProfilebyId(this.userId ?? '').subscribe({
      next: (res) => {
        this.user = res.result;
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
  refetchUserData(event: boolean) {
    if (event) {
      this.fetchUserData();
      this.isClosing = false;
      this.closeProfilePopup();
    }
  }

  fetchMyAssignExercise() {
    this.exerciseService.getMyAssignExercise().subscribe({
      next: (res) => {
        // Nối dữ liệu mới vào danh sách hiện tại
        this.assignments = res.result.data;
        this.calculateMyAssignments(this.assignments);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  fetchQuizSubmitted() {
    this.exerciseService.getMySubmissionsHistory(1, 10).subscribe({
      next: (res) => {
        // Nối dữ liệu mới vào danh sách hiện tại
        this.submissions = res.result.data;
        this.calculateSubmissionStats(this.submissions);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  // Thêm hàm format số
  private formatNumber(num: number): string {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }

  // Sửa lại hàm tính toán
  private calculateMyAssignments(assignments: MyAssignExerciseResponse[]) {
    const total = assignments.length;

    // dùng formatNumber để gán
    this.totalAssignments = total;

    // Nếu bạn muốn hiển thị đã format, tạo thêm biến string
    this.totalAssignmentsDisplay = this.formatNumber(total);
  }
  // Sửa lại hàm tính toán
  private calculateSubmissionStats(
    submissions: MySubmissionsHistoryResponse[]
  ) {
    const total = submissions.length;
    const passed = submissions.filter((s) => s.passed).length;

    // dùng formatNumber để gán
    this.totalSubmissions = total;
    this.passedSubmissions = passed;

    // Nếu bạn muốn hiển thị đã format, tạo thêm biến string
    this.totalSubmissionsDisplay = this.formatNumber(total);
    this.passedSubmissionsDisplay = this.formatNumber(passed);
  }
  loadExercises(): void {
    if (
      this.isLoadingExercises ||
      (this.totalPages && this.page > this.totalPages)
    )
      return;

    this.isLoadingExercises = true;
    this.exerciseService.getSavedExercises(this.page, this.size).subscribe({
      next: (res) => {
        const data = res.result;
        this.exercises.push(...data.data);
        this.totalPages = data.totalPages;
        this.page++;
        this.isLoadingExercises = false;
      },
      error: () => {
        this.isLoadingExercises = false;
      },
    });
  }

  onUnsave(exercise: ExerciseSave, event: MouseEvent): void {
    event.stopPropagation();
    this.exerciseService
      .unSaveExercise(exercise.exercise.exerciseId)
      .subscribe({
        next: () => {
          this.exercises = this.exercises.filter(
            (e) => e.exercise.exerciseId !== exercise.exercise.exerciseId
          );
        },
      });
  }

  goToExercise(id: string, type: 'CODING' | 'QUIZ') {
    if (type === 'QUIZ') {
      this.router.navigate(['/exercise/exercise-layout/exercise-details/', id]);
    } else {
      this.router.navigate([
        '/exercise/exercise-layout/exercise-code-details/',
        id,
      ]);
    }
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
  onDisplayNameClick(row: User, close: boolean) {
    this.openedUser = row;
    this.isClosing = close;
  }
  closeProfilePopup() {
    this.isClosing = true;
    setTimeout(() => {
      this.openedUser = null;
      this.isClosing = false;
    }, 200); // Thời gian đúng với animation
  }
}
