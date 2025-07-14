// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list';

const routes: Routes = [
  {
    path: 'user-list',
    component: UserListComponent,
    data: { breadcrumb: 'Danh sách người dùng' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
