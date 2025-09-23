import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrPaymentComponent } from './pages/qr-payment/qr-payment.component';
import { ConfirmExitGuard } from '../../core/guards/confirm-exit/confirm-exit.guard';
import { PaymentLayoutComponent } from './payment-layout/payment-layout.component';
import { TransactionHistoryComponent } from './pages/transaction-history/transaction-history.component';
import { PurchaseHistoryComponent } from './pages/purchase-history/purchase-history.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentLayoutComponent,
    children: [
      {
        path: 'payment',
        component: QrPaymentComponent,
        canDeactivate: [ConfirmExitGuard],
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'transaction-history',
        component: TransactionHistoryComponent,
      },
      {
        path: 'purchase-history',
        component: PurchaseHistoryComponent,
      },
      {
        path: '**',
        loadComponent: () =>
          import('../auth/pages/error-404/error-404.component').then(
            (m) => m.Error404Component
          ),
      },
    ],
    title: 'Dịch vụ và thanh toán',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceAndPaymentRoutingModule {}
