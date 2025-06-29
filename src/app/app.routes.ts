import { Routes } from '@angular/router';
import { MainLayout } from './layouts/layout-pages/main-layout/main-layout';
import { SecondLayout } from './layouts/layout-pages/second-layout/second-layout';
import { WrongDirectComponent } from './features/auth/pages/wrong-direct/wrong-direct.component';

export const routes: Routes = [
  {
    path: 'main',
    component: MainLayout, // Layout cho các trang không có header, sidebar, ...
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'post',
        loadChildren: () =>
          import('./features/post/post.module').then((m) => m.PostModule),
      },

      // Thêm các route auth khác nếu cần...
    ],
  },
  {
    path: 'second',
    component: SecondLayout, // Layout cho các trang không có header, sidebar, ...
    children: [
      {
        path: 'example-using-component-slide',
        loadChildren: () =>
          import('./features/example-slide/example-slide.module').then(
            (m) => m.ExampleSlideModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.AdminModule
          ),
      },
      // Thêm các route auth khác nếu cần...
      {
        path: 'landing',
        loadChildren: () =>
          import('./features/landing/landing.module').then(
            (m) => m.LandingModule
          ),
      },
    ],
  },
];
