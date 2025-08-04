import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgListComponent } from './pages/org-list/org-list';

const routes: Routes = [
  {
    path: 'org-list',
    component: OrgListComponent,
    data: { breadcrumb: 'Danh sách tổ chức' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrgManagementRoutingModule {}
