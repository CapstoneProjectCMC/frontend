import { Component } from '@angular/core';
import { StatisticsService } from '../../../../core/services/api-service/statistics.service';
import { ExerciseStatisticsResponse } from '../../../../core/models/statistics.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { finalize } from 'rxjs/internal/operators/finalize';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-admin-statistics',
  imports: [CommonModule],
  templateUrl: './exercise-admin-statistics.component.html',
  styleUrl: './exercise-admin-statistics.component.scss',
})
export class ExerciseAdminStatisticsComponent {
  // Dữ liệu và trạng thái
  statsData: ExerciseStatisticsResponse[] = [];
  isLoading = false;
  error: string | null = null;
  private statsSubscription: Subscription | undefined;

  // Thuộc tính phân trang
  currentPage = 1;
  totalPages = 0;
  pageSize = 8; // Bạn có thể thay đổi số lượng item mỗi trang ở đây
  totalElements = 0;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(page: number = 1): void {
    if (this.isLoading) return; // Ngăn gọi lại khi đang tải

    this.isLoading = true;
    this.error = null;
    this.currentPage = page;

    this.statsSubscription = this.statisticsService
      .getAdminExerciseStats(this.currentPage, this.pageSize)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.result) {
            const paginationResult = response.result;
            this.statsData = paginationResult.data;
            this.currentPage = paginationResult.currentPage;
            this.totalPages = paginationResult.totalPages;
            this.totalElements = paginationResult.totalElements;
          } else {
            this.error = 'Dữ liệu trả về không hợp lệ.';
            this.statsData = [];
          }
        },
        error: (err) => {
          console.error('Lỗi khi lấy dữ liệu thống kê:', err);
          this.error = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
          this.statsData = [];
        },
      });
  }

  // Chuyển trang
  onPageChange(newPage: number): void {
    if (
      newPage >= 1 &&
      newPage <= this.totalPages &&
      newPage !== this.currentPage
    ) {
      this.loadStats(newPage);
    }
  }

  // Tạo mảng số trang để dễ dàng lặp trong template
  getPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  ngOnDestroy(): void {
    this.statsSubscription?.unsubscribe();
  }
}
