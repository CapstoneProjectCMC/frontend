// auth.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module'; // <-- Import ở đây

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule, // <-- Tích hợp route vào module
  ],
})
export class AuthModule {}
