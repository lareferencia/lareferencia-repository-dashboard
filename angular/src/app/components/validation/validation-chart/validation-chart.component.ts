import { Component, Input } from '@angular/core';
import { View } from 'vega';
import { HarvestingHistory } from 'src/app/shared/models/harvesting-history.model';
import { FormGroup, FormControl } from '@angular/forms';
declare const vega: any;

@Component({
  selector: 'app-validation-chart',
  templateUrl: './validation-chart.component.html',
  styleUrls: ['./validation-chart.component.css'],
})
export class ValidationChartComponent {
  @Input() harvestingHistory: HarvestingHistory;
  view: View;
  date: FormGroup;
  startDate = new Date();
  endDate = new Date();
  today = new Date();
  lastYear = new Date();
  data = [];
  hideGraph = false;

  chartDef = {
    name: 'line',
    path: './assets/charts/stacked.json',
  };

  constructor() {
    this.lastYear.setFullYear(this.lastYear.getFullYear() - 1);
    this.startDate.setFullYear(this.startDate.getFullYear() - 1);
    this.date = new FormGroup({
      start: new FormControl(this.lastYear),
      end: new FormControl(this.today),
    });
  }

  public handleChart(chartData: View) {
    this.view = chartData;
    this.filterGraph(this.startDate, this.endDate);
  }

  clearClick() {
    this.date.setValue({ start: this.lastYear, end: this.today });
    this.filterGraph(this.lastYear, this.today);
  }

  filterClick(e: FormGroup) {
    this.startDate = e.value.start;
    this.endDate = e.value.end;
    this.filterGraph(this.startDate, this.endDate);
  }

  filterGraph(startDate: Date, endDate: Date) {
    this.data = [];

    this.harvestingHistory.content
      .filter(
        (x) =>
          new Date(x.startTime).getTime() > new Date(startDate).getTime() &&
          new Date(x.endTime).getTime() < new Date(endDate).getTime()
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
