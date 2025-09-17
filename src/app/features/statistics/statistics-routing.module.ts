import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsLayoutComponent } from './statistics-layout/statistics-layout.component';
import { ExerciseAdminStatisticsComponent } from './pages/exercise-admin-statistics/exercise-admin-statistics.component';
import { SummaryStatisticsComponent } from './pages/summary-statistics/summary-statistics.component';
import { PaymentStatisticsComponent } from './pages/payment-statistics/payment-statistics.component';
import { UserPaymentStatisticsComponent } from './pages/user-payment-statistic/user-payment-statistic.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsLayoutComponent,
    title: 'Thống kê',
    children: [
      {
        path: 'admin-exercise-statistics',
        component: ExerciseAdminStatisticsComponent,
        data: { breadcrumb: 'Thống kê bài tập' },
      },
      {
        path: 'admin-chart-exercise-statistics',
        component: SummaryStatisticsComponent,
        data: { breadcrumb: 'Thống kê bài tập' },
      },
      {
        path: 'admin-payment-statistics', //thêm vào đây
        component: PaymentStatisticsComponent, //thêm vào đây
        data: { breadcrumb: 'Thống kê doanh thu' },
      },
      {
        path: 'user-payment-statistics', //thêm vào đây
        component: UserPaymentStatisticsComponent, //thêm vào đây
        data: { breadcrumb: 'Thống kê nạp & mua' },
      },
      //thêm vào đây
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {}
