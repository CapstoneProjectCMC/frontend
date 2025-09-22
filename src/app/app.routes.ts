import { Routes } from '@angular/router';
// import { MainLayout } from './layouts/layout-pages/main-layout/main-layout';
// import { SecondLayout } from './layouts/layout-pages/second-layout/second-layout';
import { AuthLayoutComponent } from './layouts/layout-pages/auth-layout/auth-layout.component';
import { AppLayoutComponent } from './layouts/layout-pages/app-layout/app-layout.component';
import { AdminLayoutComponent } from './layouts/layout-pages/admin-layout/admin-layout';
// import { RoleGuard } from './core/guards/router-protected/role.guard';
import { PostModule } from './features/post/post.module';

export const routes: Routes = [
  //Để test
  // {
  //   path: 'main',
  //   component: MainLayout, // Layout cho các trang không có header, sidebar, ...
  //   data: { breadcrumb: 'Home' },
  //   children: [
  //     {
  //       path: 'auth',
  //       loadChildren: () =>
  //         import('./features/auth/auth.module').then((m) => m.AuthModule),
  //       data: { skipBreadcrumb: true },
  //     },
  //     {
  //       path: 'post',
  //       loadChildren: () =>
  //         import('./features/post/post.module').then((m) => m.PostModule),
  //       data: { breadcrumb: 'Bài viết' },
  //     },

  //     {
  //       path: 'student-statistic',
  //       loadChildren: () =>
  //         import('./features/student-statistic/student-statistic.module').then(
  //           (m) => m.StudentStatisticModule
  //         ),
  //       data: { breadcrumb: 'Thống kê' },
  //     },

  //     {
  //       path: 'landing',
  //       loadChildren: () =>
  //         import('./features/landing/landing.module').then(
  //           (m) => m.LandingModule
  //         ),
  //       data: { breadcrumb: 'landing' },
  //     },
  //     // Thêm các route auth khác nếu cần...
  //   ],
  // },
  // {
  //   path: 'second',
  //   component: SecondLayout, // Layout cho các trang không có header, sidebar, ...
  //   data: { skipBreadcrumb: true },
  //   children: [
  //     {
  //       path: 'example-using-component-slide',
  //       loadChildren: () =>
  //         import('./features/example-slide/example-slide.module').then(
  //           (m) => m.ExampleSlideModule
  //         ),
  //       data: { skipBreadcrumb: true },
  //     },
  //     {
  //       path: 'dashboard',
  //       loadChildren: () =>
  //         import('./features/dashboard/dashboard.module').then(
  //           (m) => m.AdminModule
  //         ),
  //       data: { skipBreadcrumb: true },
  //     },
  //     // Thêm các route auth khác nếu cần...
  //   ],
  // },

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

  //Load app chính
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
        title: 'CodeCampus',
      },
      {
        path: 'exercise',
        loadChildren: () =>
          import('./features/excercise/exercise.module').then(
            (m) => m.ExerciseModule
          ),
      },
      {
        path: 'conversations',
        loadChildren: () =>
          import('./features/conversation-chat/conversation-chat.module').then(
            (m) => m.ConversationChatModule
          ),
      },
      {
        path: 'post-features',
        loadChildren: () => PostModule, //Load đầu tiên k dùng lazyload
      },
      {
        path: 'resource-learning',
        loadChildren: () =>
          import('./features/resource-learning/resource-learning.module').then(
            (m) => m.ResourceLearningModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'service-and-payment',
        loadChildren: () =>
          import('./features/service-payment/service-and-payment.module').then(
            (m) => m.ServiceAndPaymentModule
          ),
      },
      {
        path: 'codecampus-statistics',
        loadChildren: () =>
          import('./features/statistics/statistics.module').then(
            (m) => m.StatisticsModule
          ),
      },
      {
        path: 'organization',
        loadChildren: () =>
          import('./features/organization/organization.module').then(
            (m) => m.OrganizationModule
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
        path: 'excercise-management',
        loadChildren: () =>
          import(
            './features/admin/exercise-management/exercise-management-routing.module'
          ).then((m) => m.ExerciseAdminRoutingModule),
        data: { breadcrumb: 'Quản lý bài tập' },
      },
      {
        path: 'org-management',
        loadChildren: () =>
          import(
            './features/admin/org-management/org-management-routing.module'
          ).then((m) => m.OrgManagementRoutingModule),
        data: { breadcrumb: 'Quản lý tổ chức' },
      },
      {
        path: 'resource-management',
        loadChildren: () =>
          import(
            './features/admin/resources-management/resource-management-routing.module'
          ).then((m) => m.ResourceManagementRoutingModule),
        data: { breadcrumb: 'Quản lý tài nguyên' },
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/auth/pages/error-404/error-404.component').then(
        (m) => m.Error404Component
      ),
  },
];
