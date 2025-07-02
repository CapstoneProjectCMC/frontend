import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/my-shared/header/header';
import { FooterComponent } from '../../../shared/components/my-shared/footer/footer';
import { BreadcrumbComponent } from '../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
  imports: [HeaderComponent, FooterComponent, BreadcrumbComponent],
  standalone: true,
})
export class LandingComponent {
  constructor() {}
}
