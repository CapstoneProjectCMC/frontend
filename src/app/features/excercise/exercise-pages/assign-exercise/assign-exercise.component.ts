import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import {
  AssignedStudentsListResponse,
  MySubmissionsHistoryResponse,
} from '../../../../core/models/exercise.model';
import { CodingService } from '../../../../core/services/api-service/coding.service';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';

@Component({
  selector: 'app-assign-exercise',
  templateUrl: './assign-exercise.component.html',
  styleUrls: ['./assign-exercise.component.scss'],
  imports: [CommonModule, FormsModule, ScrollEndDirective],
})
export class AssignExerciseComponent implements OnInit {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

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

  assignedStudents: AssignedStudentsListResponse[] = [];
  isLoadingAssigned = true;
  assignedPage = 1;
  assignedSize = 3;
  assignedTotalPages = 1;
  assignedTotalElements = 0;
  assignedFilterCompleted: boolean | undefined = undefined; // undefined = all, true/false = filter
  assignedSearchTerm = ''; // Tìm kiếm riêng cho assigned

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
    this.loadAssignedStudents();
  }

  loadAssignedStudents(page: number = this.assignedPage): void {
    this.isLoadingAssigned = true;
    this.exerciseService
      .getAssignedStudentsForExercise(
        page,
        this.assignedSize,
        this.exerciseId,
        this.assignedFilterCompleted
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.assignedStudents = res.data;
            this.assignedTotalPages = res.totalPages;
            this.assignedTotalElements = res.totalElements;
            this.assignedPage = res.currentPage;
          }
          this.isLoadingAssigned = false;
        },
        error: (err) => {
          console.error('Lỗi tải danh sách assigned:', err);
          this.isLoadingAssigned = false;
          // Có thể add toast error
        },
      });
  }

  filterAssignedStudents(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      // Nếu search term thay đổi, reset page và load lại (có thể add param q vào API nếu hỗ trợ)
      this.assignedPage = 1;
      this.loadAssignedStudents();
    }, 500);
  }

  changeAssignedPage(delta: number): void {
    const newPage = this.assignedPage + delta;
    if (newPage >= 1 && newPage <= this.assignedTotalPages) {
      this.loadAssignedStudents(newPage);
    }
  }

  setAssignedFilter(completed: boolean | undefined): void {
    this.assignedFilterCompleted = completed;
    this.assignedPage = 1;
    this.loadAssignedStudents();
  }

  remindStudent(assignmentId: string): void {
    // Implement gửi notification, ví dụ call API remind
    sendNotification(
      this.store,
      'Nhắc nhở',
      'Đã gửi nhắc nhở đến học sinh',
      'info'
    );
  }

  deleteAssignment(assignmentId: string): void {
    // Confirm dialog, rồi call API delete, refresh list
    if (confirm('Xác nhận xóa giao bài?')) {
      // Giả sử có method delete
      // this.exerciseService.deleteAssignment(assignmentId).subscribe(() => {
      //   this.loadAssignedStudents();
      // });
    }
  }

  loadNextPageListStudent(): void {
    if (this.isLoadingSearchUser) return; // tránh spam gọi khi đang loading
    this.isLoadingSearchUser = true;

    this.page++;

    this.userService
      .searchUserProfile(this.page, this.size, { q: this.searchTerm })
      .subscribe({
        next: (res) => {
          if (res.result) {
            const selectedIds = new Set(
              this.selectedStudents.map((s) => s.userId)
            );

            // merge thêm data mới vào danh sách
            this.allStudents = [...this.allStudents, ...res.result.data];

            // lọc ra available (chưa chọn)
            const newAvailable = res.result.data.filter(
              (student) => !selectedIds.has(student.userId)
            );
            this.availableStudents = [
              ...this.availableStudents,
              ...newAvailable,
            ];
          }
          this.isLoadingSearchUser = false;
        },
        error: (err) => {
          console.error('Lỗi khi load thêm học sinh:', err);
          this.isLoadingSearchUser = false;
          this.page--; // rollback page nếu lỗi
        },
      });
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
