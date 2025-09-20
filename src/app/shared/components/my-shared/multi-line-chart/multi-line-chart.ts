import {
  Component,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-multi-line-chart',
  templateUrl: './multi-line-chart.html',
  styleUrls: ['./multi-line-chart.scss'],
  imports: [NgApexchartsModule],
  standalone: true,
})
export class MultiLineChartComponent implements OnChanges {
  @ViewChild('chart') chart!: ChartComponent;

  // ✅ Nhận categories và series động từ bên ngoài
  @Input() categories: string[] = [];
  @Input() seriesData: ApexAxisChartSeries = [];

  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'bar',
      height: 350,
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: {
        text: 'Amount (VND)',
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + ' VND';
        },
      },
    },
    legend: {
      position: 'top',
    },
    fill: {
      opacity: 1,
    },
    plotOptions: {
      bar: {
        columnWidth: '55%',
        borderRadius: 5,
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChart();
  }

  private updateChart() {
    this.chartOptions.series = this.seriesData;
    this.chartOptions.xaxis = {
      categories: this.categories,
    };
  }
}
