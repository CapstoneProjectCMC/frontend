import { Component } from '@angular/core';
import { PieChartComponent } from '../../../shared/components/my-shared/pie-chart/pie-chart';
import { LineChartComponent } from '../../../shared/components/my-shared/line-chart/line-chart';

@Component({
  selector: 'app-student-statistic',
  standalone: true,
  imports: [PieChartComponent, LineChartComponent],
  templateUrl: './student-statistic.component.html',
  styleUrls: ['./student-statistic.component.scss'],
})
export class StudentStatisticComponent {}
