import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
  imports: [BreadcrumbComponent],
  standalone: true,
})
export class LandingComponent {
  constructor() {}
}
