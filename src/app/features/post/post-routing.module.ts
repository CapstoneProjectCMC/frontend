import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './pages/post-list/post-list';
import { PostDetailComponent } from './pages/post-detail/post-detail';
import { PostCreatePageComponent } from './pages/post-create/post-create';
import { PostLayoutComponent } from './post-layout/post-layout.component';
import { SavedPostsListComponent } from './pages/saved-posts-list/saved-posts-list.component';
import { MyPostComponent } from './pages/my-post/my-post';

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
      {
        path: 'saved-posts-list',
        component: SavedPostsListComponent,
        data: { breadcrumb: 'Bài đăng đã lưu' },
        title: 'Danh sách lưu',
      },
      {
        path: 'my-posts-list',
        component: MyPostComponent,
        data: { breadcrumb: 'Bài đăng của tôi' },
        title: 'Danh sách bài đăng của tôi',
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
