import { Component } from '@angular/core';
import { PieChartComponent } from '../../../shared/components/my-shared/pie-chart/pie-chart';
import { LineChartComponent } from '../../../shared/components/my-shared/line-chart/line-chart';
import { BreadcrumbComponent } from '../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-student-statistic',
  standalone: true,
  imports: [PieChartComponent, LineChartComponent, BreadcrumbComponent],
  templateUrl: './student-statistic.component.html',
  styleUrls: ['./student-statistic.component.scss'],
})
export class StudentStatisticComponent {}
