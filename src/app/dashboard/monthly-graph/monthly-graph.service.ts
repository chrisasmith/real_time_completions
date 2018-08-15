import {Injectable} from '@angular/core';
import {DashGraphDataPoint, DashGraphModel} from '../shared/dash-graph.model';
import {PrintChartValues} from '../../shared/chartjs-plugins/print-values-on-chart.plugin';
import {Chart} from 'chart.js';
import * as moment from 'moment';

@Injectable()
export class MonthlyGraphService {
  public data: DashGraphDataPoint[];
  public chart: Chart;

  constructor() { }

  createGraph(el: HTMLCanvasElement, barColor: string, fontColor: string, data: any, yMetric: string, xMetric: string = ''): void {
    if (!data) {
      return;
    }
    this.data = data;
    const ctx = el.getContext('2d');
    const config = {
      type: 'bar',
      data: {
        labels: this.createLabels(data),
        datasets: this.createDataSet(data, barColor)
      },
      plugins: [
        PrintChartValues,
      ],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          fontSize: 16,
          display: true,
          text: yMetric,
          fontColor,
        },
        legend: {
          display: false,
          labels: {
            fontColor
          }
        },
        tooltips: {
          mode: 'index',
          enabled: true,
        },
        scales: {
          tooltips: {
            mode: 'index'
          },
          yAxes: [
            this.createAxes(yMetric, fontColor),
          ],
          xAxes: [
            this.createAxes(xMetric, fontColor)
          ]
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  purge(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private getMaxY(): number {
    if (!this.data) {
      return 0;
    }
    return Math.floor(this.data.reduce((acc, curr) => acc > curr.y ? acc : curr.y, 0) * 1.2);
  }

  private createAxes(label: string, fontColor: string): any {
    return {
      stacked: true,
      scaleLabel: {
        display: false,
        // labelString: label,
        fontColor,
      },
      ticks: {
        fontColor,
        max: this.getMaxY(),
      }
    };
  }

  private createLabels(data: DashGraphDataPoint[]): string[] {
    return data.map((el) => moment.months(el.x - 1));
  }

  private createDataSet(data: DashGraphDataPoint[], color: string): any {
    return [{
      label: '',
      fontColor: '#626f86',
      backgroundColor: Chart.helpers.color(color)/*.alpha(0.5)*/.rgbString(),
      borderColor:  Chart.helpers.color(color)/*.alpha(0.8)*/.rgbString(),
      // borderWidth: 1,
      data: data
    }];
  }

}
