// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutOrganizationComponent } from './layout-organization/layout-organization.component';
import { OrganizationManagementComponent } from './pages/organization-management/organization-management.component';
import { RoleGuard } from '../../core/guards/router-protected/role.guard';
import { OrgBlocksComponent } from './pages/org-blocks/org-blocks.component';
import { BlockDetailsComponent } from './pages/block-details/block-details.component';
import { OrgDetailsComponent } from './pages/org-details/org-details.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutOrganizationComponent,
    children: [
      {
        path: 'orgs-list',
        component: OrganizationManagementComponent,
        title: 'Quản lý tổ chức',
        data: { breadcrumb: 'Quản lý tổ chức' },
      },
      {
        path: 'in-org/:orgId',
        component: OrgDetailsComponent,
        children: [
          {
            path: 'org-details',
            component: OrgBlocksComponent,
            title: 'Chi tiết tổ chức',
            data: { breadcrumb: 'Chi tiết tổ chức' },
          },
          {
            path: 'block-details/:blockId',
            component: BlockDetailsComponent,
            title: 'Chi tiết khối',
            data: { breadcrumb: 'Chi tiết khối' },
          },
        ],
        title: 'Tổ chức',
        data: { breadcrumb: 'Tổ chức' },
      },
    ],
  },

  { path: '', redirectTo: 'list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
