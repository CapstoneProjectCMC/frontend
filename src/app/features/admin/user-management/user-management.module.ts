// student-manage.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserManagementRoutingModule, // <-- Tích hợp route vào module
  ],
})
export class StudentManagementModule {}
