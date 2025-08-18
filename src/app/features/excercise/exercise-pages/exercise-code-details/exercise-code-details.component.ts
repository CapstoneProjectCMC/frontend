import { Component } from '@angular/core';
import {
  ExerciseCodeResponse,
  TestCaseResponse,
  CodingDetailResponse,
  UpdateCodingDetailRequest,
} from '../../../../core/models/code.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodingService } from '../../../../core/services/api-service/coding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';
import { UpdateCodeDetailsComponent } from '../../exercise-modal/update-code-details/update-code-details.component';
import {
  openModalNotification,
  sendNotification,
} from '../../../../shared/utils/notification';
import { decodeJWT } from '../../../../shared/utils/stringProcess';
import { ProfileService } from '../../../../core/services/api-service/profile.service';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';

@Component({
  selector: 'app-exercise-code-details',
  imports: [CommonModule, FormsModule, UpdateCodeDetailsComponent],
  templateUrl: './exercise-code-details.component.html',
  styleUrls: ['./exercise-code-details.component.scss'],
})
export class ExerciseCodeDetailsComponent {
  exercise: ExerciseCodeResponse | null = null;
  exerciseId: string = '';
  role = decodeJWT(localStorage.getItem('token') ?? '')?.payload.scope;

  // Modal state
  isUpdateModalVisible: boolean = false;
  authorName: string = '';
  avatarUrl: string = '';
  avatarUrlDefault: string =
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50';

  constructor(
    private codingService: CodingService,
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private exerciseService: ExerciseService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.exerciseId) {
      this.fetchCodingDetails();
    }

    // Initialize with one test case if creating new exercise
    if (!this.exerciseId) {
      this.router.navigate(['/exercise/exercise-layout/list']);
    }
  }

  fetchCodingDetails() {
    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({ isLoading: true, content: 'Đang lấy dữ liệu chi tiết...' })
      );
    });

    this.codingService
      .getCodingExercise(this.exerciseId, 1, 99999, 'CREATED_AT', false)
      .subscribe({
        next: (res) => {
          this.exercise = res.result;
          this.hasNoDetails();
          this.store.dispatch(clearLoading());
          this.getUserInfo(res.result.userId);
        },
        error: (err) => {
          console.log(err);
          if (err.code === 4048310) {
            this.hasNoDetails();
          } else {
            this.router.navigate(['/exercise/exercise-layout/list']);
          }
          this.store.dispatch(clearLoading());
        },
      });
  }

  getUserInfo(userId: string) {
    this.profileService.getProfilebyId(userId).subscribe({
      next: (res) => {
        this.authorName = res.result.displayName;
        this.avatarUrl = res.result.avatarUrl;
      },
      error: () => {
        console.log('Lỗi lấy thông tin tác giả.');
      },
    });
  }

  hasNoDetails() {
    if (!this.exercise) {
      this.router.navigate([
        '/exercise/exercise-layout/exercise-code-details/add-new',
        this.exerciseId,
      ]);
    }
  }

  // Lọc và trả về chỉ các test case là mẫu (sample = true)
  getSampleTestCases(): TestCaseResponse[] {
    if (this.exercise?.codingDetail?.testCases && this.role === 'ROLE_USER') {
      return this.exercise.codingDetail.testCases.filter((tc) => tc.sample);
    } else if (this.exercise?.codingDetail?.testCases) {
      return this.exercise.codingDetail.testCases;
    }
    return [];
  }

  goBack() {
    this.router.navigate(['/exercise/exercise-layout/list']);
  }

  // Modal methods
  openUpdateModal(): void {
    this.isUpdateModalVisible = true;
  }

  openWarningModal() {
    openModalNotification(
      this.store,
      'Xác nhận xóa bài',
      `Bạn có chắc chắn Xóa bài tập "${this.exercise?.title}" này?`,
      'Xác nhận',
      'Hủy',
      () => this.confirmDeleteExercise()
    );
  }

  confirmDeleteExercise() {
    if (this.exerciseId) {
      this.store.dispatch(
        setLoading({ isLoading: true, content: 'Xóa bài tập...' })
      );
      this.exerciseService.softDeleteExercise(this.exerciseId).subscribe({
        next: () => {
          this.router.navigate(['/exercise/exercise-layout/list']);
          sendNotification(
            this.store,
            'Đã xóa',
            'Đã xóa bài tập thành công',
            'success'
          );
          this.store.dispatch(clearLoading());
        },
        error: () => {
          console.log('Có lỗi khi xóa');
          this.store.dispatch(clearLoading());
        },
      });
    } else {
      sendNotification(
        this.store,
        'Lỗi xóa!',
        'Không tìm thấy dữ liệu bài tập cần xóa.',
        'error'
      );
    }
  }

  closeUpdateModal(): void {
    this.isUpdateModalVisible = false;
  }

  onSaveCodingDetails(updatedCodingDetail: UpdateCodingDetailRequest): void {
    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({
          isLoading: true,
          content: 'Đang cập nhật dữ liệu chi tiết...',
        })
      );
    });

    // Gọi API để cập nhật coding details
    this.codingService
      .updateCodingDetails(this.exerciseId, updatedCodingDetail)
      .subscribe({
        next: (res: any) => {
          // Cập nhật lại dữ liệu local bằng cách fetch lại data
          this.fetchCodingDetails();

          this.closeUpdateModal();
          this.store.dispatch(clearLoading());

          // Hiển thị thông báo thành công
          sendNotification(
            this.store,
            'Thành công',
            'Đã cập nhật chi tiết bài tập',
            'success'
          );
        },
        error: (err: any) => {
          console.error('Error updating coding details:', err);
          this.store.dispatch(clearLoading());
        },
      });
  }

  confirmCoding() {
    this.router.navigate([
      '/exercise/exercise-layout/code-submission',
      this.exerciseId,
    ]);
  }
}
