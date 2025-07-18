import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
  imports: [BreadcrumbComponent],
  standalone: true,
})
export class LandingComponent {
  constructor(private router: Router) {}

  getStart() {
    this.router.navigate(['/exercise/exercise-layout/list']);
  }
}
