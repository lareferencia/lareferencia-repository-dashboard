import { Component, Input } from '@angular/core';
import { View } from 'vega';
import { HarvestingHistory } from 'src/app/shared/models/harvesting-history.model';
import { DateFilter } from 'src/app/shared/models/date-filter.model';
declare const vega: any;

@Component({
  selector: 'app-validation-chart',
  templateUrl: './validation-chart.component.html',
  styleUrls: ['./validation-chart.component.css'],
})
export class ValidationChartComponent {
  @Input() harvestingHistory: HarvestingHistory;
  view: View;
  date: DateFilter;
  lastYear = new Date();
  data = [];
  hideGraph = false;

  chartDef = {
    name: 'line',
    path: './assets/charts/stacked.json',
  };

  constructor() {
    this.lastYear.setFullYear(this.lastYear.getFullYear() - 1);
    this.date = {startDate: this.lastYear, endDate: new Date()};
  }

  public handleChart(chartData: View) {
    this.view = chartData;
    this.filterGraph();
  }

  clearClick() {
    this.date = {startDate: new Date(this.lastYear), endDate: new Date()};
    this.filterGraph();
  }

  filterClick(e: DateFilter) {
    this.date = {startDate: e.startDate, endDate: e.endDate};
    this.filterGraph();
  }

  filterGraph() {
    this.data = [];

    this.harvestingHistory.content
      .filter(
        (x) =>
          new Date(x.startTime).getTime() > new Date(this.date.startDate).getTime() &&
          new Date(x.endTime).getTime() < new Date(this.date.endDate).getTime()
      )
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      .forEach((result) => {
        this.data.push(
          {
            x: result.id,
            y: result.validSize,
            c: 0,
          },
          {
            x: result.id,
            y: result.harvestedSize - result.validSize,
            c: 1,
          }
        );
      });

    this.hideGraph = this.data.length == 0;
    const changeSet = vega.changeset().remove(vega.truthy).insert(this.data);
    this.view.change('table', changeSet).run();
  }
}
