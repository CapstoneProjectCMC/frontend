import { Routes } from '@angular/router';
import { MainLayout } from './layouts/layout-pages/main-layout/main-layout';
import { SecondLayout } from './layouts/layout-pages/second-layout/second-layout';
import { AuthLayoutComponent } from './layouts/layout-pages/auth-layout/auth-layout.component';
import { AppLayoutComponent } from './layouts/layout-pages/app-layout/app-layout.component';
import { AdminLayoutComponent } from './layouts/layout-pages/admin-layout/admin-layout';

export const routes: Routes = [
  //Để test
  {
    path: 'main',
    component: MainLayout, // Layout cho các trang không có header, sidebar, ...
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.module').then((m) => m.AuthModule),
        data: { skipBreadcrumb: true },
      },
      {
        path: 'post',
        loadChildren: () =>
          import('./features/post/post.module').then((m) => m.PostModule),
        data: { breadcrumb: 'Bài viết' },
      },

      {
        path: 'student-statistic',
        loadChildren: () =>
          import('./features/student-statistic/student-statistic.module').then(
            (m) => m.StudentStatisticModule
          ),
        data: { breadcrumb: 'Thống kê' },
      },

      {
        path: 'landing',
        loadChildren: () =>
          import('./features/landing/landing.module').then(
            (m) => m.LandingModule
          ),
        data: { breadcrumb: 'landing' },
      },
      // Thêm các route auth khác nếu cần...
    ],
  },
  {
    path: 'second',
    component: SecondLayout, // Layout cho các trang không có header, sidebar, ...
    data: { skipBreadcrumb: true },
    children: [
      {
        path: 'example-using-component-slide',
        loadChildren: () =>
          import('./features/example-slide/example-slide.module').then(
            (m) => m.ExampleSlideModule
          ),
        data: { skipBreadcrumb: true },
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.AdminModule
          ),
        data: { skipBreadcrumb: true },
      },
      // Thêm các route auth khác nếu cần...
    ],
  },

  //Tính năng phân quyền, bảo mật
  {
    path: 'auth',
    component: AuthLayoutComponent,
    data: { skipBreadcrumb: true },
    children: [
      {
        path: 'identity',
        loadChildren: () =>
          import('./features/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },

  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/landing/landing.module').then(
            (m) => m.LandingModule
          ),
      },
      {
        path: 'exercise',
        loadChildren: () =>
          import('./features/excercise/exercise.module').then(
            (m) => m.ExerciseModule
          ),
      },
    ],
  },

  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'user-management',
        loadChildren: () =>
          import(
            './features/admin/user-management/user-management.module'
          ).then((m) => m.StudentManagementModule),
        data: { breadcrumb: 'Quản lý người dùng' },
      },
      {
        path: 'post-management',
        loadChildren: () =>
          import(
            './features/admin/post-management/post-management-routing.module'
          ).then((m) => m.PostManagementRoutingModule),
        data: { breadcrumb: 'Quản lý bài đăng' },
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/auth/pages/error-404/error-404.component').then(
            (m) => m.Error404Component
          ),
      },
    ],
  },
];
