// student-manage.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfileRoutingModule, // <-- Tích hợp route vào module
  ],
})
export class ProfileModule {}
