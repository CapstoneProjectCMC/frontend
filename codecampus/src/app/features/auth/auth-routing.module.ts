// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  // có thể thêm forgot-password, reset-password,...
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
