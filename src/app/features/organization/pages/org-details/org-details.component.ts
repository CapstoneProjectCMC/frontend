import { Component } from '@angular/core';
import { DetailsOrganizationComponent } from '../../organization-component/details-organization/details-organization.component';
import { AdminRoutingModule } from '../../../dashboard/dashboard-routing.module';

@Component({
  selector: 'app-in-a-organization',
  imports: [DetailsOrganizationComponent, AdminRoutingModule],
  templateUrl: './org-details.component.html',
  styleUrl: './org-details.component.scss',
})
export class OrgDetailsComponent {}
