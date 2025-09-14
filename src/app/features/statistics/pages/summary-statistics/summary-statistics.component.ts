import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ApexNonAxisChartSeries } from 'ng-apexcharts';
import { PieChartComponent } from '../../../../shared/components/my-shared/pie-chart/pie-chart';
import { StatisticsService } from '../../../../core/services/api-service/statistics.service';
import { SummaryStatisticsAdmin } from '../../../../core/models/statistics.model';

@Component({
  selector: 'app-summary-statistics',
  imports: [CommonModule, PieChartComponent],
  templateUrl: './summary-statistics.component.html',
  styleUrl: './summary-statistics.component.scss',
})
export class SummaryStatisticsComponent {
  summaryData: SummaryStatisticsAdmin | null = null;
  isLoading = false;
  error: string | null = null;
  private summarySubscription: Subscription | undefined;

  // Dữ liệu cho các biểu đồ
  exerciseTypeData: ApexNonAxisChartSeries = [];
  exerciseTypeLabels: string[] = [];

  completionRateData: ApexNonAxisChartSeries = [];
  completionRateLabels: string[] = [];

  passRateData: ApexNonAxisChartSeries = [];
  passRateLabels: string[] = [];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading = true;
    this.error = null;
    this.summarySubscription = this.statisticsService
      .getAdminSummary()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.result) {
            this.summaryData = response.result;
            this.prepareChartData(); // Chuẩn bị dữ liệu sau khi nhận thành công
          } else {
            this.error = 'Dữ liệu trả về không hợp lệ.';
          }
        },
        error: (err) => {
          console.error('Lỗi khi lấy dữ liệu tổng quan:', err);
          this.error = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
        },
      });
  }

  prepareChartData(): void {
    if (!this.summaryData) return;

    // 1. Biểu đồ Phân loại Bài tập
    this.exerciseTypeLabels = ['Quiz', 'Coding'];
    this.exerciseTypeData = [
      this.summaryData.totalQuiz,
      this.summaryData.totalCoding,
    ];

    // 2. Biểu đồ Tỷ lệ Hoàn thành
    const incompleteAssignments =
      this.summaryData.totalAssignments -
      this.summaryData.totalCompletedAssignments;
    this.completionRateLabels = ['Đã hoàn thành', 'Chưa hoàn thành'];
    this.completionRateData = [
      this.summaryData.totalCompletedAssignments,
      incompleteAssignments,
    ];

    // 3. Biểu đồ Tỷ lệ Nộp bài Đạt
    const failedSubmissions =
      this.summaryData.totalSubmissions -
      this.summaryData.totalPassedSubmissions;
    this.passRateLabels = ['Đạt', 'Chưa đạt'];
    this.passRateData = [
      this.summaryData.totalPassedSubmissions,
      failedSubmissions,
    ];
  }

  ngOnDestroy(): void {
    this.summarySubscription?.unsubscribe();
  }
}
