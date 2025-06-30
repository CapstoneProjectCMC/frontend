import {
  Component,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import {
  ChartComponent,
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  value: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'fx-pie-chart',
  templateUrl: './pie-chart.html',
  styleUrls: ['./pie-chart.scss'],
  standalone: true,
  imports: [NgApexchartsModule],
})
export class PieChartComponent implements OnChanges, OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  @Input() value!: ApexNonAxisChartSeries;
  @Input() labels!: any;
  @Input() width: number = 380;
  @Input() responsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ];

  public chartOptions: ChartOptions = {
    value: [],
    chart: {
      width: this.width,
      type: 'pie',
    },
    labels: [],
    responsive: this.responsive,
  };

  ngOnInit(): void {
    this.validateRequiredInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['value'] ||
      changes['labels'] ||
      changes['width'] ||
      changes['responsive']
    ) {
      this.validateRequiredInputs();
      this.updateChartOptions();
    }
  }

  private validateRequiredInputs(): void {
    if (!this.value || this.value.length === 0) {
      throw new Error(
        'fx-pie-chart: Input "value" is required and cannot be empty'
      );
    }
    if (!this.labels || this.labels.length === 0) {
      throw new Error(
        'fx-pie-chart: Input "labels" is required and cannot be empty'
      );
    }
    if (this.value.length !== this.labels.length) {
      throw new Error(
        `fx-pie-chart: Input "value" length (${this.value.length}) must match "labels" length (${this.labels.length})`
      );
    }
  }

  private updateChartOptions(): void {
    this.chartOptions = {
      value: this.value,
      chart: {
        width: this.width,
        type: 'pie',
      },
      labels: this.labels,
      responsive: this.responsive,
    };
  }
}
