// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { WrongDirectComponent } from './pages/wrong-direct/wrong-direct.component';
import { Error500Component } from './pages/error-500/error-500.component';
import { Error400Component } from './pages/error-400/error-400.component';
import { OauthCallbackComponent } from './pages/oauth-callback/oauth-callback';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'authenticate', component: OauthCallbackComponent },
  // có thể thêm forgot-password, reset-password,...
  { path: 'error-500', component: Error500Component },
  { path: 'error-400', component: Error400Component },
  { path: '**', component: WrongDirectComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
