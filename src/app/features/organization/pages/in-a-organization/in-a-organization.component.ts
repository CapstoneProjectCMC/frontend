import { Component } from '@angular/core';
import { DetailsOrganizationComponent } from '../../organization-component/details-organization/details-organization.component';
import { AdminRoutingModule } from '../../../dashboard/dashboard-routing.module';

@Component({
  selector: 'app-in-a-organization',
  imports: [DetailsOrganizationComponent, AdminRoutingModule],
  templateUrl: './in-a-organization.component.html',
  styleUrl: './in-a-organization.component.scss',
})
export class InAOrganizationComponent {}
