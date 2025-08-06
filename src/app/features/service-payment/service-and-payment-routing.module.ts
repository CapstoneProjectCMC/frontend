import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrPaymentComponent } from './pages/qr-payment/qr-payment.component';

const routes: Routes = [
  {
    path: 'payment',
    component: QrPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceAndPaymentRoutingModule {}
