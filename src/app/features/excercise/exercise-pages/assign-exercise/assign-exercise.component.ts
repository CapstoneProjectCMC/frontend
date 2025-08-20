import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  SearchUserProfileResponse,
  User,
} from '../../../../core/models/user.models';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { UserService } from '../../../../core/services/api-service/user.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';
import { sendNotification } from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { Subscription } from 'rxjs/internal/Subscription';
import { MySubmissionsHistoryResponse } from '../../../../core/models/exercise.model';
import { CodingService } from '../../../../core/services/api-service/coding.service';

@Component({
  selector: 'app-assign-exercise',
  templateUrl: './assign-exercise.component.html',
  styleUrls: ['./assign-exercise.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class AssignExerciseComponent implements OnInit {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private checkTypeExercise: string[] = [
    '/assign-exercise-code',
    '/assign-exercise-quiz',
  ];

  avatarUrlDefault: string = avatarUrlDefault;
  exerciseTypeCall: MySubmissionsHistoryResponse['exerciseType'] = 'QUIZ';
  // Font Awesome Icons

  page = 1;
  size = 10;

  // Data lists
  allStudents: SearchUserProfileResponse[] = [];
  availableStudents: SearchUserProfileResponse[] = [];
  selectedStudents: SearchUserProfileResponse[] = [];

  // State management
  isLoading = true;
  isLoadingSearchUser = false;
  exerciseId!: string;
  exerciseName = ''; // Lấy từ route hoặc service
  searchTerm = '';
  dueAt: string = '';

  constructor(
    private exerciseService: ExerciseService,
    private codingService: CodingService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy param id từ route
    this.exerciseId = this.route.snapshot.paramMap.get('id')!;

    // Lấy URL hiện tại
    const currentUrl = this.router.url;

    if (currentUrl.includes('/assign-exercise-code')) {
      this.exerciseTypeCall = 'CODING';
    } else if (currentUrl.includes('/assign-exercise-quiz')) {
      this.exerciseTypeCall = 'QUIZ';
    }

    this.loadExerciseAndStudents(this.exerciseId);
  }

  loadExerciseAndStudents(id: string): void {
    this.isLoading = true;

    forkJoin({
      exercise:
        this.exerciseTypeCall === 'QUIZ'
          ? this.exerciseService
              .getExerciseDetails(1, 99999, 'CREATED_AT', false, id)
              .pipe(
                catchError((err) => {
                  console.error('Lỗi lấy bài tập:', err);
                  return of(null); // Trả về null thay vì fail toàn bộ
                })
              )
          : this.codingService
              .getCodingExercise(id, 1, 99999, 'CREATED_AT', false)
              .pipe(
                catchError((err) => {
                  console.error('Lỗi lấy bài tập:', err);
                  return of(null); // Trả về null thay vì fail toàn bộ
                })
              ),
      students: this.userService
        .searchUserProfile(this.page, this.size, { q: this.searchTerm })
        .pipe(
          catchError((err) => {
            console.error('Lỗi lấy học sinh:', err);
            return of(null);
          })
        ),
    }).subscribe({
      next: (res) => {
        // Xử lý dữ liệu bài tập
        if (res.exercise?.result) {
          this.exerciseName = res.exercise.result.title;
        }

        // Xử lý dữ liệu học sinh
        if (res.students?.result) {
          this.allStudents = res.students.result.data;
          this.availableStudents = [...this.allStudents];
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi load dữ liệu:', err);
        this.isLoading = false;
      },
    });
  }

  filterAvailableStudents(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.fetchDataAfterSearchingUser();
    }, 500); // chờ 500ms sau khi dừng gõ mới gọi
  }

  fetchDataAfterSearchingUser(): void {
    this.isLoadingSearchUser = true;
    this.userService
      .searchUserProfile(this.page, this.size, { q: this.searchTerm })
      .subscribe({
        next: (res) => {
          if (res.result) {
            const selectedIds = new Set(
              this.selectedStudents.map((s) => s.userId)
            );

            // chỉ giữ những student chưa được chọn
            this.allStudents = res.result.data;
            this.availableStudents = this.allStudents.filter(
              (student) => !selectedIds.has(student.userId)
            );
          }
          this.isLoadingSearchUser = false;
        },
        error: (err) => {
          console.error('Lỗi khi load dữ liệu:', err);
          this.isLoadingSearchUser = false;
        },
      });
  }

  selectStudent(student: SearchUserProfileResponse): void {
    this.selectedStudents.push(student);
    this.availableStudents = this.availableStudents.filter(
      (s) => s.userId !== student.userId
    );
    this.filterAvailableStudents(); // Cập nhật lại cả 2 danh sách
  }

  deselectStudent(studentToRemove: SearchUserProfileResponse): void {
    this.isLoadingSearchUser = true;
    this.selectedStudents = this.selectedStudents.filter(
      (student) => student.userId !== studentToRemove.userId
    );
    this.filterAvailableStudents(); // Cập nhật lại cả 2 danh sách
  }

  assignExercise(): void {
    if (this.selectedStudents.length === 0 || !this.dueAt) {
      // Thông báo cho người dùng rằng cần chọn học sinh và hạn nộp
      return;
    }

    const studentIds = this.selectedStudents.map((s) => s.userId);

    // Chuyển đổi dueAt sang định dạng ISO 8601 nếu API yêu cầu
    const dueAtISO = new Date(this.dueAt).toISOString().split('.')[0] + 'Z';

    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({
          isLoading: true,
          content: 'Đang xử lý giao bài, xin chờ...',
        })
      );
    });

    this.exerciseService
      .assignExerciseToStudent(this.exerciseId, studentIds, dueAtISO)
      .subscribe({
        next: () => {
          // Thông báo thành công!
          sendNotification(
            this.store,
            'Đã giao bài tập',
            'Bài tập đã được giao cho học sinh chỉ định',
            'success'
          );
          this.location.back();
          this.store.dispatch(clearLoading());
        },
        error: (err) => {
          console.error('Lỗi khi giao bài tập:', err);
          this.store.dispatch(clearLoading());
        },
      });
  }
}
