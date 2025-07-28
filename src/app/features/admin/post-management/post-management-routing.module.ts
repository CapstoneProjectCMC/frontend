// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './pages/post-list/post-list';
import { PostDetailComponent } from './pages/post-detail/post-detail';

const routes: Routes = [
  {
    path: 'post-list',
    component: PostListComponent,
    data: { breadcrumb: 'Danh sách bài đăng' },
    children: [],
  },
  {
    path: 'post/:id',
    component: PostDetailComponent,
    data: { breadcrumb: 'Chi tiết bài đăng' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostManagementRoutingModule {}
