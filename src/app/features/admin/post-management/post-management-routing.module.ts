// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from '../../post/pages/post-list/post-list';
import { PostDetailComponent } from '../../post/pages/post-detail/post-detail';
import { PostCreatePageComponent } from '../../post/pages/post-create/post-create';

const routes: Routes = [
  {
    path: 'post-list',
    component: PostListComponent,
    data: { breadcrumb: 'Danh sách bài đăng' },
    children: [],
    title: 'Danh sách bài đăng',
  },
  {
    path: 'post-details/:id',
    component: PostDetailComponent,
    data: { breadcrumb: 'Chi tiết bài đăng' },
    title: 'Chi tiết bài đăng',
  },
  {
    path: 'post-create',
    component: PostCreatePageComponent,
    data: { breadcrumb: 'Tạo bài đăng' },
    title: 'Đăng bài',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostManagementRoutingModule {}
