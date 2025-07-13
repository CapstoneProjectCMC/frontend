// student-manage.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentManagementRoutingModule } from './student-management-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StudentManagementRoutingModule, // <-- Tích hợp route vào module
  ],
})
export class StudentManagementModule {}
