// student-manage.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgManagementRoutingModule } from './org-management-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OrgManagementRoutingModule, // <-- Tích hợp route vào module
  ],
})
export class OrgManagementModule {}
