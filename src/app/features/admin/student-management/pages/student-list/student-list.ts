import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.scss'],
  imports: [BreadcrumbComponent],
  standalone: true,
})
export class StudentListComponent {
  constructor() {}
}
