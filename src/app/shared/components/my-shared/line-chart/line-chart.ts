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
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
} from 'ng-apexcharts';
import { NgIf } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'fx-line-chart',
  templateUrl: './line-chart.html',
  styleUrls: ['./line-chart.scss'],
  standalone: true,
  imports: [NgApexchartsModule, NgIf],
})
export class LineChartComponent implements OnChanges, OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  @Input() categories!: string[];
  @Input() series!: ApexAxisChartSeries;
  @Input() height: number = 350;
  @Input() chartTitle: string = '';
  @Input() responsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ];

  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'bar',
      height: 350,
      width: 1000,
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
            show: true,
          },
        },
      },
    ],
    plotOptions: { bar: { horizontal: false, columnWidth: '40%' } },
    xaxis: {
      type: 'category',
      categories: [],
      labels: { rotate: -45, style: { fontSize: '12px' } },
    },
    legend: { show: true, position: 'right', offsetY: 40 },
    fill: { opacity: 1 },
    dataLabels: { enabled: false },
  };

  public hasInputError = false;

  ngOnInit(): void {
    this.validateRequiredInputs();
    this.updateChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['categories'] ||
      changes['series'] ||
      changes['height'] ||
      changes['responsive']
    ) {
      this.validateRequiredInputs();
      this.updateChartOptions();
    }
  }

  private validateRequiredInputs(): void {
    this.hasInputError = false;
    if (!this.categories || this.categories.length === 0) {
      this.hasInputError = true;
      this.chartOptions.series = [];
      this.chartOptions.xaxis = {
        type: 'category',
        categories: [],
        labels: { rotate: -45, style: { fontSize: '12px' } },
      };
      return;
    }
    if (!this.series || this.series.length === 0) {
      this.hasInputError = true;
      this.chartOptions.series = [];
      this.chartOptions.xaxis = {
        type: 'category',
        categories: this.categories,
        labels: { rotate: -45, style: { fontSize: '12px' } },
      };
      return;
    }
    for (const s of this.series) {
      if (!s.data || s.data.length !== this.categories.length) {
        this.hasInputError = true;
        this.chartOptions.series = [];
        this.chartOptions.xaxis = {
          type: 'category',
          categories: this.categories,
          labels: { rotate: -45, style: { fontSize: '12px' } },
        };
        return;
      }
    }
  }

  private updateChartOptions(): void {
    if (this.hasInputError) return;
    this.chartOptions = {
      series: this.series,
      chart: {
        type: 'bar',
        height: this.height,
        width: 1000,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: this.responsive,
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '80%',
        },
      },
      xaxis: {
        type: 'category',
        categories: this.categories,
        labels: {
          show: true,
          rotate: 0,
          style: { fontSize: '12px' },
          trim: false,
          hideOverlappingLabels: false,
          showDuplicates: true,
          maxHeight: 120,
        },
      },
      legend: {
        show: true,
        position: 'right',
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
      dataLabels: {
        enabled: false,
      },
    };
  }
}
