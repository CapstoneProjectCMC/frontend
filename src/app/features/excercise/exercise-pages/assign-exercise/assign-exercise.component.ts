import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faSearch,
  faPlus,
  faTimes,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'; // Import model User
import { User } from '../../../../core/models/user.models';
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

@Component({
  selector: 'app-assign-exercise',
  templateUrl: './assign-exercise.component.html',
  styleUrls: ['./assign-exercise.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class AssignExerciseComponent implements OnInit {
  avatarUrlDefault: string = avatarUrlDefault;
  // Font Awesome Icons
  faSearch = faSearch;
  faPlus = faPlus;
  faTimes = faTimes;
  faPaperPlane = faPaperPlane;

  page = 1;
  size = 10;

  // Data lists
  allStudents: User[] = [];
  availableStudents: User[] = [];
  selectedStudents: User[] = [];

  // State management
  isLoading = true;
  exerciseId!: string;
  exerciseName = ''; // Lấy từ route hoặc service
  searchTerm = '';
  dueAt: string = '';

  constructor(
    private exerciseService: ExerciseService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id')!;
    this.loadExerciseAndStudents(this.exerciseId);
  }

  loadExerciseAndStudents(id: string): void {
    this.isLoading = true;

    forkJoin({
      exercise: this.exerciseService
        .getExerciseDetails(1, 99999, 'CREATED_AT', false, id)
        .pipe(
          catchError((err) => {
            console.error('Lỗi lấy bài tập:', err);
            return of(null); // Trả về null thay vì fail toàn bộ
          })
        ),
      students: this.userService
        .getAllUser(this.page, this.size, 'CREATED_AT', false)
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
    const term = this.searchTerm.toLowerCase();
    const selectedIds = new Set(this.selectedStudents.map((s) => s.userId));

    this.availableStudents = this.allStudents.filter((student) => {
      const name = student.displayName ? student.displayName.toLowerCase() : '';
      const email = student.email ? student.email.toLowerCase() : '';

      return (
        !selectedIds.has(student.userId) &&
        (name.includes(term) || email.includes(term))
      );
    });
  }

  selectStudent(student: User): void {
    this.selectedStudents.push(student);
    this.filterAvailableStudents(); // Cập nhật lại cả 2 danh sách
  }

  deselectStudent(studentToRemove: User): void {
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
