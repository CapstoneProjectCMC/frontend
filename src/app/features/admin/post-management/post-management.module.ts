// student-manage.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostManagementRoutingModule } from './post-management-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PostManagementRoutingModule, // <-- Tích hợp route vào module
  ],
})
export class PostManagementModule {}
