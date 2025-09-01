import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './pages/post-list/post-list';
import { PostDetailComponent } from './pages/post-detail/post-detail';
import { PostCreatePageComponent } from './pages/post-create/post-create';
import { PostLayoutComponent } from './post-layout/post-layout.component';

const routes: Routes = [
  {
    path: '',
    component: PostLayoutComponent,
    children: [
      {
        path: 'post-list',
        component: PostListComponent,
        data: { breadcrumb: 'Danh sách bài đăng' },
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
    ],
  },

  //real
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostRoutingModule {}
