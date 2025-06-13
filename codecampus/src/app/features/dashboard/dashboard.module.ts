// auth.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Statistics } from './pages/statistics/statistics';
import { Dashboard } from './pages/dashboard/dashboard';
import { AdminRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule, // <-- Tích hợp route vào module
  ],
})
export class AdminModule {}
