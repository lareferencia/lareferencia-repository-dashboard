import { HarvestingHistory } from './../../../shared/models/harvesting-history.model';
import { Component, OnInit, Input, Inject, LOCALE_ID } from '@angular/core';
import { View } from 'vega';
import { DateFilter } from 'src/app/shared/models/date-filter.model';
import { TimeUnit } from 'src/app/shared/enums/time-unit';
import * as moment from 'moment';
import { groupBy } from 'src/app/shared/util/ArrayUtil';
import { HarvestingContent } from 'src/app/shared/models/harvesting-content.model';
declare const vega: any;

@Component({
  selector: 'app-harvesting-chart',
  templateUrl: './harvesting-chart.component.html',
  styleUrls: ['./harvesting-chart.component.css']
})
export class HarvestingChartComponent {
  @Input() harvestingHistory: HarvestingHistory;
  view: View;
  date: DateFilter;
  lastYear = new Date();
  timeUnit = TimeUnit.Unitary;
  data = [];
  hideGraph = false;

  chartDef = {
    name: 'line',
    path: './assets/charts/grouped-horizontal.json',
  };

  constructor(@Inject(LOCALE_ID) locale: string) {
    moment.locale(locale);
    this.lastYear.setFullYear(this.lastYear.getFullYear() - 1);
    this.date = { startDate: this.lastYear, endDate: new Date(), timeUnit: this.timeUnit };
  }

  public handleChart(chartData: View) {
    this.view = chartData;
    this.filterGraph();
  }

  clearClick() {
    this.date = { startDate: new Date(this.lastYear), endDate: new Date(), timeUnit: this.timeUnit };
    this.filterGraph();
  }

  filterClick(e: DateFilter) {
    this.date = { startDate: e.startDate, endDate: e.endDate, timeUnit: e.timeUnit };
    this.filterGraph();
  }

  filterGraph() {
    this.data = [];

    let groupedHarvesting = groupBy(this.harvestingHistory.content, (dt) => {
      switch (this.date.timeUnit) {
        case TimeUnit.Unitary:
          return moment(dt.startTime);
        case TimeUnit.Daily:
          return moment(dt.startTime).startOf('day').format();
        case TimeUnit.Weekly:
          return moment(dt.startTime).startOf('week').format();
        case TimeUnit.Monthly:
          return moment(dt.startTime).startOf('month').format();
        case TimeUnit.Yearly:
          return moment(dt.startTime).startOf('year').format();
      }
    });

    const harvestingHistory = Object.entries(groupedHarvesting).map(([key, value]) => ({ key, value }));

    harvestingHistory
    .filter(
      (x) =>
        new Date(x.value[0].startTime).getTime() > new Date(this.date.startDate).getTime() &&
        new Date(x.value[0].endTime).getTime() < new Date(this.date.endDate).getTime()
    )
    .sort((a, b) =>new Date(a.key).getTime() - new Date(b.key).getTime())
    .forEach((element) => {

      const harvesting = element.value as HarvestingContent[];
      const startTime = moment(harvesting[0].startTime);
      
      let category = "";
      const validSize = harvesting.reduce((a, b) => a + b.validSize, 0) / harvesting.length;
      const invalidSize = harvesting.reduce((a, b) => a + (b.harvestedSize - b.validSize), 0) / harvesting.length;
      const transformedSize = harvesting.reduce((a, b) => a + b.transformedSize, 0) / harvesting.length;

      switch (this.date.timeUnit) {
        case TimeUnit.Unitary: {
          category = startTime.format('L LT');
          break;
        }
        case TimeUnit.Daily: {
          category = startTime.format('L');
          break;
        }
        case TimeUnit.Weekly: {
          const date = moment(startTime);
          const firstDayWeek = date.weekday(0).format('L');
          const lastDayWeek = date.weekday(6).format('L');
          category = firstDayWeek + ' - ' + lastDayWeek;
          break;
        }
        case TimeUnit.Monthly: {
          category = startTime.format('MM/YYYY');
          break;
        }
        case TimeUnit.Yearly: {
          category = startTime.year().toString();
          break;
        }
      }

      this.data.push(
          {
            category: category,
            position: 0,
            value: validSize,
          },
          {
            category: category,
            position: 1,
            value: invalidSize,
          },
          {
            category: category,
            position: 2,
            value: transformedSize,
          }
        );
    });

    const dataLength = this.data.length;
    this.hideGraph = dataLength == 0;
    const changeSet = vega.changeset().remove(vega.truthy).insert(this.data);
    this.view.change('table', changeSet).run();
    this.view.width(dataLength * 50).run();
  }
}
