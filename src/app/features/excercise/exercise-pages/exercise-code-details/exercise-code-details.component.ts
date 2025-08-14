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

@Component({
  selector: 'app-exercise-code-details',
  imports: [CommonModule, FormsModule, UpdateCodeDetailsComponent],
  templateUrl: './exercise-code-details.component.html',
  styleUrls: ['./exercise-code-details.component.scss'],
})
export class ExerciseCodeDetailsComponent {
  exercise: ExerciseCodeResponse | null = null;
  exerciseId: string = '';

  // Modal state
  isUpdateModalVisible: boolean = false;

  constructor(
    private codingService: CodingService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';
    // Để component hoạt động ngay cả khi chưa có @Input, ta có thể dùng mock data
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
    if (this.exercise?.codingDetail?.testCases) {
      return this.exercise.codingDetail.testCases.filter((tc) => tc.sample);
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

  closeUpdateModal(): void {
    this.isUpdateModalVisible = false;
  }

  onSaveCodingDetails(updatedCodingDetail: UpdateCodingDetailRequest): void {
    this.store.dispatch(
      setLoading({ isLoading: true, content: 'Đang cập nhật chi tiết...' })
    );

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
          // sendNotification(this.store, 'Thành công', 'Đã cập nhật chi tiết bài tập', 'success');
        },
        error: (err: any) => {
          console.error('Error updating coding details:', err);
          this.store.dispatch(clearLoading());
          // Hiển thị thông báo lỗi
          // sendNotification(this.store, 'Lỗi', 'Không thể cập nhật chi tiết bài tập', 'error');
        },
      });
  }
}
