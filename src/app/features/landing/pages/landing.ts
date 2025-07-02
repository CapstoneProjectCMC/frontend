import { Component } from '@angular/core';
import { FooterComponent } from '../../../shared/components/my-shared/footer/footer';
import { BreadcrumbComponent } from '../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
  imports: [FooterComponent, BreadcrumbComponent],
  standalone: true,
})
export class LandingComponent {
  constructor() {}
}
