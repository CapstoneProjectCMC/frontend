// auth.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module'; // <-- Import ở đây
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule, // <-- Tích hợp route vào module
    FontAwesomeModule,
    FormsModule,
  ],
})
export class AuthModule {}
