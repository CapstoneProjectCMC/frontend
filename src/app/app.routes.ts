import { Routes } from '@angular/router';
import { MainLayout } from './layouts/layout-pages/main-layout/main-layout';
import { SecondLayout } from './layouts/layout-pages/second-layout/second-layout';

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
      // Thêm các route auth khác nếu cần...
    ],
  },
  {
    path: 'second',
    component: SecondLayout, // Layout cho các trang không có header, sidebar, ...
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.AdminModule
          ),
      },
      // Thêm các route auth khác nếu cần...
    ],
  },
];
