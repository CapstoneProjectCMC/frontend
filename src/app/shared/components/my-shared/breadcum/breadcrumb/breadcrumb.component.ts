import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { BreadcrumbService, Breadcrumb } from '../breadcrumb.service';
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterModule, NgForOf, NgIf],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  constructor(private breadcrumbService: BreadcrumbService) {
    console.log('BreadcrumbComponent đã được khởi tạo');
  }
  get breadcrumbs(): Breadcrumb[] {
    console.log('Breadcrumbs getter:', this.breadcrumbService.breadcrumbs);
    return this.breadcrumbService.breadcrumbs;
  }
}
