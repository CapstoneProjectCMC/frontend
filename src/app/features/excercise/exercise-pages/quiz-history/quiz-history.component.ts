import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MyQuizHistoryResponse } from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';
import { Router } from '@angular/router';
import { LottieComponent } from 'ngx-lottie';
import { lottieOptions } from '../../../../core/constants/value.constant';
import { SkeletonLoadingComponent } from '../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';

@Component({
  selector: 'app-quiz-history',
  imports: [
    CommonModule,
    ScrollEndDirective,
    LottieComponent,
    SkeletonLoadingComponent,
  ],
  templateUrl: './quiz-history.component.html',
  styleUrl: './quiz-history.component.scss',
})
export class QuizHistoryComponent {
  submissions: MyQuizHistoryResponse[] | [] = [];
  currentPage = 1;
  totalPages = 1; // Khởi tạo là 1 để tránh lỗi
  pageSize = 5; // Cấu hình số lượng item mỗi trang

  isLoadingInitial = true;
  isLoadingNextPage = false;

  lottieOptions = lottieOptions;

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchQuizSubmitted(true);
  }

  fetchQuizSubmitted(isInitialLoad = false) {
    if (isInitialLoad) {
      this.isLoadingInitial = true;
    } else {
      this.isLoadingNextPage = true;
    }
    this.exerciseService
      .getMyQuizHistory(this.currentPage, this.pageSize)
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
      this.fetchQuizSubmitted();
    }
  }

  goToQuizDetails(id: string) {
    this.router.navigate(['/exercise/exercise-layout/exercise-details/', id]);
  }
}
