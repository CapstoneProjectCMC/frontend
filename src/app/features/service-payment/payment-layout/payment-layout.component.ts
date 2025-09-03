import { Component } from '@angular/core';
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { SidebarItem } from '../../../core/models/data-handle';
import { RouterOutlet } from '@angular/router';
import { decodeJWT } from '../../../shared/utils/stringProcess';

import { sidebarPaymentRouter } from '../../../core/router-manager/vetical-menu-dynamic/payment-vertical-menu';

@Component({
  selector: 'app-payment-layout',
  imports: [MainSidebarComponent, RouterOutlet],
  templateUrl: './payment-layout.component.html',
  styleUrl: './payment-layout.component.scss',
})
export class PaymentLayoutComponent {
  isSidebarCollapsed = true;
  sidebarData: SidebarItem[] = [];

  showSidebar = true;

  constructor() {
    const role = decodeJWT(localStorage.getItem('token') ?? '')?.payload.scope;
    this.sidebarData = sidebarPaymentRouter(role);
  }
}
