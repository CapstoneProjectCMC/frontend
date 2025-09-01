import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceLearningLayoutComponent } from './resource-learning-layout/resource-learning-layout.component';
import { ResourceListComponent } from './pages/resource-list/resource-list';
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceLearningRoutingModule {}
