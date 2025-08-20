import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { CommonModule } from '@angular/common';
import { MyAssignExerciseResponse } from '../../../../core/models/exercise.model';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';
import { Router } from '@angular/router';
// Giả sử bạn đã bổ sung exerciseName vào type

@Component({
  selector: 'app-my-assignments',
  templateUrl: './my-assignments.component.html',
  styleUrls: ['./my-assignments.component.scss'],
  imports: [CommonModule, ScrollEndDirective],
})
export class MyAssignmentsComponent implements OnInit {
  assignments: MyAssignExerciseResponse[] = [];
  currentPage = 0;
  totalPages = 1; // Khởi tạo là 1 để tránh lỗi
  pageSize = 6; // Cấu hình số lượng item mỗi trang

  isLoadingInitial = true;
  isLoadingNextPage = false;

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAssignments(true);
  }

  doExercise(exId: string, type: 'CODING' | 'QUIZ') {
    if (type === 'CODING') {
      this.router.navigate([
        '/exercise/exercise-layout/exercise-code-details',
        exId,
      ]);
    } else {
      this.router.navigate([
        '/exercise/exercise-layout/exercise-details',
        exId,
      ]);
    }
  }

  loadAssignments(isInitialLoad = false): void {
    if (isInitialLoad) {
      this.isLoadingInitial = true;
    } else {
      this.isLoadingNextPage = true;
    }

    this.exerciseService
      .getMyAssignExercise(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          const paginatedResult = response.result;
          // Nối dữ liệu mới vào danh sách hiện tại
          this.assignments = [...this.assignments, ...paginatedResult.data];
          this.totalPages = paginatedResult.totalPages;

          if (isInitialLoad) {
            this.isLoadingInitial = false;
          } else {
            this.isLoadingNextPage = false;
          }
        },
        error: (err) => {
          console.error('Failed to load assignments:', err);
          this.isLoadingInitial = false;
          this.isLoadingNextPage = false;
        },
      });
  }

  loadNextPage(): void {
    // Chỉ tải trang tiếp theo nếu không phải là trang cuối và không đang tải
    if (this.currentPage < this.totalPages - 1 && !this.isLoadingNextPage) {
      this.currentPage++;
      this.loadAssignments();
    }
  }

  calculateProgress(assignment: MyAssignExerciseResponse): number {
    if (!assignment.totalPoints || assignment.totalPoints === 0) {
      return 0;
    }
    return ((assignment.myBestScore || 0) / assignment.totalPoints) * 100;
  }

  getCardStatus(assignment: MyAssignExerciseResponse): {
    className: string;
    label: string;
  } {
    if (assignment.completed) {
      return { className: 'completed', label: 'Đã hoàn thành' };
    }
    const dueDate = new Date(assignment.dueAt);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime < 0) {
      return { className: 'overdue', label: 'Đã quá hạn' };
    }
    if (diffDays) {
      // Sắp đến hạn nếu còn 3 ngày hoặc ít hơn
      return { className: 'due-soon', label: `Còn ${diffDays} ngày` };
    }
    return { className: 'todo', label: 'Chưa làm' };
  }
}
