import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MyQuizHistoryResponse } from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';
import { Router } from '@angular/router';
import { MyCodeHistoryResponse } from '../../../../core/models/code.model';

@Component({
  selector: 'app-code-history',
  imports: [CommonModule, ScrollEndDirective],
  templateUrl: './code-history.component.html',
  styleUrl: './code-history.component.scss',
})
export class CodeHistoryComponent {
  submissions: MyCodeHistoryResponse[] | [] = [];
  currentPage = 1;
  totalPages = 1; // Khởi tạo là 1 để tránh lỗi
  pageSize = 5; // Cấu hình số lượng item mỗi trang

  isLoadingInitial = true;
  isLoadingNextPage = false;

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchCodeSubmitted(true);
  }

  fetchCodeSubmitted(isInitialLoad = false) {
    if (isInitialLoad) {
      this.isLoadingInitial = true;
    } else {
      this.isLoadingNextPage = true;
    }
    this.exerciseService
      .getMyCodeHistory(this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          const paginatedResult = res.result;
          // Nối dữ liệu mới vào danh sách hiện tại
          this.submissions = [...this.submissions, ...paginatedResult.data];
          this.totalPages = paginatedResult.totalPages;

          if (isInitialLoad) {
            this.isLoadingInitial = false;
          } else {
            this.isLoadingNextPage = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoadingInitial = false;
          this.isLoadingNextPage = false;
        },
      });
  }

  loadNextPage() {
    // Chỉ tải trang tiếp theo nếu không phải là trang cuối và không đang tải
    if (this.currentPage < this.totalPages && !this.isLoadingNextPage) {
      this.currentPage++;
      this.fetchCodeSubmitted();
    }
  }

  goToQuizDetails(id: string) {
    this.router.navigate(['/exercise/exercise-layout/exercise-details/', id]);
  }
}
