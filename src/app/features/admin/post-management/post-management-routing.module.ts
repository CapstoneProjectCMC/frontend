// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './pages/post-list/post-list';

const routes: Routes = [
  {
    path: 'post-list',
    component: PostListComponent,
    data: { breadcrumb: 'Danh sách bài đăng' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostManagementRoutingModule {}
