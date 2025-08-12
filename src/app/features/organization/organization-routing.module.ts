// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOrganizationsComponent } from './pages/list-organizations/list-organizations.component';
import { DetailsOrganizationComponent } from './pages/details-organization/details-organization.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListOrganizationsComponent,
    title: 'Danh sách tổ chức',
    data: { breadcrumb: 'Danh sách tổ chức' },
  },
  {
    path: 'details/:id',
    component: DetailsOrganizationComponent,
    children: [],
    title: 'Chi tiết tổ chức',
    data: { breadcrumb: 'Tổ chức của tôi' },
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
