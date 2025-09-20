import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // cần để dùng [(ngModel)]
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { StatisticsService } from '../../../../core/services/api-service/statistics.service';
import { PaymentStatisticsAdmin } from '../../../../core/models/statistics.model';
import { LineChartComponent } from '../../../../shared/components/my-shared/line-chart/line-chart';
import { TableComponent } from '../../../../shared/components/my-shared/table/table.component';

@Component({
  selector: 'app-payment-statistics',
  imports: [CommonModule, FormsModule, LineChartComponent, TableComponent],
  templateUrl: './payment-statistics.component.html',
  styleUrl: './payment-statistics.component.scss',
})
export class PaymentStatisticsComponent implements OnInit, OnDestroy {
  paymentData: PaymentStatisticsAdmin[] = [];
  isLoading = false;
  error: string | null = null;
  private paymentSubscription: Subscription | undefined;

  // dữ liệu thẻ
  minAmount = 0;
  maxAmount = 0;
  averageAmount = 0;
  totalAmount = 0;
  // table
  tableHeaders = [
    { label: 'Ngày', value: 'day' },
    { label: 'Số tiền nạp', value: 'totalAmount' },
  ];

  tableData: { [key: string]: any }[] = [];
  // dropdown filter
  years: number[] = [];
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;

  // chart data
  chartCategories: string[] = [];
  chartSeries: { name: string; data: number[] }[] = [];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    // generate years từ 2004 -> current year
    const currentYear = new Date().getFullYear();
    for (let y = 2004; y <= currentYear; y++) {
      this.years.push(y);
    }

    this.loadPayment();
  }

  onFilterChange(): void {
    this.loadPayment();
  }

  loadPayment(): void {
    this.isLoading = true;
    this.error = null;

    this.paymentSubscription = this.statisticsService
      .getAdminPaymentStats(this.selectedYear, this.selectedMonth)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.result) {
            this.paymentData = response.result;
            this.prepareChartData();
          } else {
            this.error = 'Dữ liệu trả về không hợp lệ.';
          }
        },
        error: (err) => {
          console.error('Lỗi khi lấy dữ liệu tiền nạp:', err);
          this.error = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
        },
      });
  }
  prepareChartData(): void {
    if (!this.paymentData || this.paymentData.length === 0) return;

    const amounts = this.paymentData.map((d) => d.totalAmount);
    this.totalAmount = amounts.reduce((sum, val) => sum + val, 0);
    this.minAmount = Math.min(...amounts);
    this.maxAmount = Math.max(...amounts);
    this.averageAmount = this.totalAmount / amounts.length;

    // Chart data
    this.chartCategories = this.paymentData.map((d) => d.day);
    this.chartSeries = [
      {
        name: 'Tiền nạp',
        data: amounts,
      },
    ];

    // Table data
    this.tableData = this.paymentData.map((d) => ({
      day: d.day,
      totalAmount: d.totalAmount,
    }));
  }
  ngOnDestroy(): void {
    this.paymentSubscription?.unsubscribe();
  }
}
