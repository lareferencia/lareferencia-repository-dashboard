import { Component, OnInit, Input } from '@angular/core';
import { View } from 'vega';
import { HarvestingHistory } from 'src/app/shared/harvesting-history.model';
declare const vega: any;

@Component({
  selector: 'app-validation-chart',
  templateUrl: './validation-chart.component.html',
  styleUrls: ['./validation-chart.component.css'],
})
export class ValidationChartComponent implements OnInit {
  @Input() harvestingHistory: HarvestingHistory;

  chartDef = {
    name: 'line',
    path: './assets/charts/line.json',
  };

  constructor() {}

  ngOnInit(): void {}

  public handleChart(chartData: View) {
    let data = [];

    this.harvestingHistory.content
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      .forEach((result) => {
        data.push(
          {
            id: result.id,
            date: new Date(result.startTime),
            count: result.transformedSize,
            type: 'transformed',
          },
          {
            id: result.id,
            date: new Date(result.startTime),
            count: result.harvestedSize,
            type: 'harvested',
          },
          {
            id: result.id,
            date: new Date(result.startTime),
            count: result.validSize,
            type: 'valid',
          }
        );
      });

    const changeSet = vega.changeset().insert(data);
    chartData.change('table', changeSet).run();
  }
}
