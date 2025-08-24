import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MySubmissionsHistoryResponse } from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { Router } from '@angular/router';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';
import { DurationFormatPipe } from '../../../../shared/pipes/duration-format.pipe';

@Component({
  selector: 'app-submisstion-history',
  imports: [CommonModule, DurationFormatPipe, ScrollEndDirective],
  templateUrl: './submisstion-history.component.html',
  styleUrl: './submisstion-history.component.scss',
})
export class SubmisstionHistoryComponent {
  submissions: MySubmissionsHistoryResponse[] | [] = [];
  pageIndex = 1;
  size = 3;
  totalPages = 1;
  isLoadingInitial = true;
  isLoadingNextPage = false;

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
      .getMySubmissionsHistory(this.pageIndex, this.size)
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
    if (this.pageIndex < this.totalPages - 1 && !this.isLoadingNextPage) {
      this.pageIndex++;
      this.fetchQuizSubmitted();
    }
  }

  goToQuizDetails(id: string, type: 'CODING' | 'QUIZ') {
    if (type === 'QUIZ') {
      this.router.navigate(['/exercise/exercise-layout/exercise-details/', id]);
    } else {
      this.router.navigate([
        '/exercise/exercise-layout/exercise-code-details/',
        id,
      ]);
    }
  }
}
