import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceLearningLayoutComponent } from './resource-learning-layout/resource-learning-layout.component';
import { ResourceListComponent } from './pages/resource-list/resource-list';
import { ResourceDetail } from './pages/resource-detail/resource-detail';
import { ResourceCreatePageComponent } from './pages/resource-create/resource-create';
const routes: Routes = [
  {
    path: '',
    component: ResourceLearningLayoutComponent,
    children: [
      {
        path: 'list-resource',
        component: ResourceListComponent,
        data: { breadcrumb: 'Danh sách tài liệu' },
        title: 'Danh sách tài liệu',
      },
      {
        path: 'resource/:id',
        component: ResourceDetail,
        data: { breadcrumb: 'Tài nguyên chi tiết' },
        title: 'Tài nguyên chi tiết',
      },
      {
        path: 'resource-create',
        component: ResourceCreatePageComponent,
        data: { breadcrumb: 'Tạo tài nguyên' },
        title: 'Tải lên tài liệu',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceLearningRoutingModule {}
