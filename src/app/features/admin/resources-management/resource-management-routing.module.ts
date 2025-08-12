// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceListComponent } from './page/resource-list/resource-list';

const routes: Routes = [
  {
    path: 'resource-list',
    component: ResourceListComponent,
    data: { breadcrumb: 'Danh sách tài nguyên' },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceManagementRoutingModule {}
