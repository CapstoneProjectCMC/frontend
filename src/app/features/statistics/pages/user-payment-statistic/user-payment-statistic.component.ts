import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // cần để dùng [(ngModel)]
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { StatisticsService } from '../../../../core/services/api-service/statistics.service';
import {
  PaymentStatisticsAdmin,
  PaymentStatisticsUser,
} from '../../../../core/models/statistics.model';
import { LineChartComponent } from '../../../../shared/components/my-shared/line-chart/line-chart';
import { TableComponent } from '../../../../shared/components/my-shared/table/table.component';
import { MultiLineChartComponent } from '../../../../shared/components/my-shared/multi-line-chart/multi-line-chart';

@Component({
  selector: 'app-user-payment-statistics',
  imports: [CommonModule, FormsModule, MultiLineChartComponent, TableComponent],
  templateUrl: './user-payment-statistic.component.html',
  styleUrls: ['./user-payment-statistic.component.scss'],
})
export class UserPaymentStatisticsComponent implements OnInit, OnDestroy {
  paymentData: PaymentStatisticsUser[] = [];
  isLoading = false;
  error: string | null = null;
  private paymentSubscription: Subscription | undefined;

  // dữ liệu thẻ
  purchaseAmount = 0;
  depositAmount = 0;
  // table
  tablePurchaseHeaders = [
    { label: 'Ngày', value: 'day' },
    { label: 'Số tiền nạp', value: 'depositAmount' },
  ];
  tableDepositHeaders = [
    { label: 'Ngày', value: 'day' },
    { label: 'Số tiền mua', value: 'purchaseAmount' },
  ];
  fakeStats = [
    {
      day: '2025-09-11',
      depositAmount: 370.0,
      purchaseAmount: 300.0,
      walletBalance: 600.0,
    },
    {
      day: '2025-09-12',
      depositAmount: 200.0,
      purchaseAmount: 100.0,
      walletBalance: 680.0,
    },
    {
      day: '2025-09-13',
      depositAmount: 100.0,
      purchaseAmount: 200.0,
      walletBalance: 680.0,
    },
    {
      day: '2025-09-14',
      depositAmount: 370.0,
      purchaseAmount: 300.0,
      walletBalance: 600.0,
    },
    {
      day: '2025-09-15',
      depositAmount: 200.0,
      purchaseAmount: 100.0,
      walletBalance: 680.0,
    },
    {
      day: '2025-09-16',
      depositAmount: 100.0,
      purchaseAmount: 200.0,
      walletBalance: 680.0,
    },
    {
      day: '2025-09-11',
      depositAmount: 370.0,
      purchaseAmount: 300.0,
      walletBalance: 600.0,
    },
    {
      day: '2025-09-12',
      depositAmount: 200.0,
      purchaseAmount: 100.0,
      walletBalance: 680.0,
    },
    {
      day: '2025-09-13',
      depositAmount: 100.0,
      purchaseAmount: 200.0,
      walletBalance: 680.0,
    },
    {
      day: '2025-09-14',
      depositAmount: 370.0,
      purchaseAmount: 300.0,
      walletBalance: 600.0,
    },
    {
      day: '2025-09-15',
      depositAmount: 200.0,
      purchaseAmount: 100.0,
      walletBalance: 680.0,
    },
    {
      day: '2025-09-16',
      depositAmount: 100.0,
      purchaseAmount: 200.0,
      walletBalance: 680.0,
    },
  ];

  tablePurchaseData: { [key: string]: any }[] = [];
  tableDepositData: { [key: string]: any }[] = [];
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
    //chuẩn bị dữ liệu cho biểu đồ
    this.convertToChartData(this.paymentData);

    this.calculateTotals(this.paymentData);
    // ✅ Gán dữ liệu BE vào chart
    const { categories, seriesData } = this.convertToChartData(
      this.paymentData
    );
    this.chartCategories = categories;
    this.chartSeries = seriesData;

    // ✅ Tính tổng nạp + chi
    this.calculateTotals(this.paymentData);

    // ✅ Chuẩn bị dữ liệu 2 bảng
    this.splitDataForTables(this.paymentData);
    // this.convertToChartData(this.fakeStats);
    // // ✅ Gán fake data vào chart
    // const { categories, seriesData } = this.convertToChartData(this.fakeStats);
    // this.chartCategories = categories;
    // this.chartSeries = seriesData;
  }

  onFilterChange(): void {
    this.loadPayment();
    //chuẩn bị dữ liệu cho biểu đồ
    this.convertToChartData(this.paymentData);

    this.calculateTotals(this.paymentData);
    // ✅ Gán dữ liệu BE vào chart
    const { categories, seriesData } = this.convertToChartData(
      this.paymentData
    );
    this.chartCategories = categories;
    this.chartSeries = seriesData;

    // ✅ Tính tổng nạp + chi
    this.calculateTotals(this.paymentData);

    // ✅ Chuẩn bị dữ liệu 2 bảng
    this.splitDataForTables(this.paymentData);
  }

  loadPayment(): void {
    this.isLoading = true;
    this.error = null;

    this.paymentSubscription = this.statisticsService
      .getUserPaymentStats(this.selectedYear, this.selectedMonth)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.result) {
            this.paymentData = response.result;
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
  calculateTotals(data: any[]) {
    this.depositAmount = data.reduce(
      (sum, item) => sum + (item.depositAmount || 0),
      0
    );
    this.purchaseAmount = data.reduce(
      (sum, item) => sum + (item.purchaseAmount || 0),
      0
    );
  }

  convertToChartData(data: any[]) {
    const categories = data.map((item) => item.day);

    const seriesData = [
      {
        name: 'Deposit',
        data: data.map((item) => item.depositAmount),
      },
      {
        name: 'Purchase',
        data: data.map((item) => item.purchaseAmount),
      },
      {
        name: 'Wallet Balance',
        data: data.map((item) => item.walletBalance),
      },
    ];

    return { categories, seriesData };
  }
  splitDataForTables(data: any[]) {
    // Bảng nạp tiền
    this.tableDepositData = data.map((item) => ({
      day: item.day,
      depositAmount: item.depositAmount,
    }));

    // Bảng mua hàng
    this.tablePurchaseData = data.map((item) => ({
      day: item.day,
      purchaseAmount: item.purchaseAmount,
    }));
  }

  ngOnDestroy(): void {
    this.paymentSubscription?.unsubscribe();
  }
}
