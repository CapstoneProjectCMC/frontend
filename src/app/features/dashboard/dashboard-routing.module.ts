// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Statistics } from './pages/statistics/statistics';

const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'statistics', component: Statistics },
  // có thể thêm forgot-password, reset-password,...
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
