import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrPaymentComponent } from './pages/qr-payment/qr-payment.component';
import { ConfirmExitGuard } from '../../core/guards/confirm-exit/confirm-exit.guard';

const routes: Routes = [
  {
    path: 'payment',
    component: QrPaymentComponent,
    canDeactivate: [ConfirmExitGuard],
    runGuardsAndResolvers: 'always',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceAndPaymentRoutingModule {}
