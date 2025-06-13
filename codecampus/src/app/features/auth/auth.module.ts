// auth.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module'; // <-- Import ở đây
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule, // <-- Tích hợp route vào module
  ],
})
export class AuthModule {}
