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
  ApexTitleSubtitle,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  responsive: any;
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
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-multi-chart',
  templateUrl: './multi-chart.html',
  styleUrls: ['./multi-chart.scss'],
  imports: [NgApexchartsModule],
  standalone: true,
})
export class MultiChartComponent implements OnChanges {
  @ViewChild('chart') chart!: ChartComponent;

  // ✅ Nhận đầu vào động
  @Input() categories: string[] = [];
  @Input() seriesData: ApexAxisChartSeries = [];
  @Input() title: string = '';
  @Input() type: 'bar' | 'line' = 'bar'; // 👈 loại biểu đồ

  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'bar', // mặc định
      height: '100%', // 👈 thay vì 350 fix cứng
      width: '100%', // 👈 ép full width
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth', // 👈 chỉ giữ curve
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
        formatter: (val: number) => val + ' VND',
      },
    },
    legend: {
      position: 'top',
    },
    fill: {
      opacity: 1,
    },
    plotOptions: {
      bar: {}, // 👈 để trống, không set width/border
    },
    title: {
      text: '',
      align: 'center',
    },
    responsive: undefined,
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChart();
  }

  private updateChart() {
    // cập nhật loại chart
    this.chartOptions.chart.type = this.type;

    // nếu là line thì bỏ plotOptions.bar đi
    if (this.type === 'line') {
      this.chartOptions.plotOptions = {} as ApexPlotOptions;
    }

    this.chartOptions.series = this.seriesData;
    this.chartOptions.xaxis = { categories: this.categories };
    this.chartOptions.title = {
      text: this.title,
      align: 'center',
    };
  }
}
