// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceListComponent } from './page/resource-list/resource-list';
import { ResourceCreatePageComponent } from './page/rename-create/resource-create';

const routes: Routes = [
  {
    path: 'resource-list',
    component: ResourceListComponent,
    data: { breadcrumb: 'Danh sách tài nguyên' },
    children: [],
  },
  {
    path: 'resource-create',
    component: ResourceCreatePageComponent,
    data: { breadcrumb: 'Tạo tài nguyên' },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceManagementRoutingModule {}
