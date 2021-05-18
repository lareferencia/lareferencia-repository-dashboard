import { Component, Inject, LOCALE_ID } from '@angular/core';
import { View } from 'vega';
import { DateFilter } from 'src/app/shared/models/date-filter.model';
import { TimeUnit } from 'src/app/shared/enums/time-unit';
import * as moment from 'moment';
import { groupBy } from 'src/app/shared/util/ArrayUtil';
import { HarvestingContent } from 'src/app/shared/models/harvesting-content.model';
import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { ActivatedRoute } from '@angular/router';
declare const vega: any;

@Component({
  selector: 'app-harvesting-chart',
  templateUrl: './harvesting-chart.component.html',
  styleUrls: ['./harvesting-chart.component.css'],
})
export class HarvestingChartComponent {
  view: View;
  date: DateFilter;
  lastYear = new Date();
  timeUnit = TimeUnit.Unitary;
  data = [];
  hideGraph = false;
  pageNumber = 0;
  pageSize = 30;
  filtrando = false;

  chartDef = {
    name: 'line',
    path: './assets/charts/grouped-horizontal.json',
  };

  constructor(
    private harvestingService: HarvestingService,
    private route: ActivatedRoute,
    @Inject(LOCALE_ID) locale: string
  ) {
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
    this.filtrando = true;
    this.data = [];
    const acronym = this.route.snapshot.paramMap.get('acronym');

    this.harvestingService
      .getHarvestingHistoryByAcronymAndDate(acronym, this.pageNumber, this.pageSize, this.date.startDate, this.date.endDate)
      .subscribe((harvestingHistory) => {

        let groupedHarvesting = groupBy(harvestingHistory.content, (dt) => {
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
    
        const groupedHarvestingEntries = Object.entries(
          groupedHarvesting
        ).map(([key, value]) => ({ key, value }));
    
        groupedHarvestingEntries
          .sort((a, b) => new Date(a.key).getTime() - new Date(b.key).getTime())
          .forEach((element) => {
            const harvesting = element.value as HarvestingContent[];
            const startTime = moment(harvesting[0].startTime);
    
            let category = '';
            const validSize =
              (harvesting.reduce((a, b) => a + b.validSize, 0) / harvesting.length | 0);
            const invalidSize =
              (harvesting.reduce((a, b) => a + (b.harvestedSize - b.validSize), 0) /
              harvesting.length | 0);
            const harvestedSize =
              (harvesting.reduce((a, b) => a + b.harvestedSize, 0) /
              harvesting.length | 0);
    
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
                value: harvestedSize,
              }
            );
          });

        let changeSet = vega.changeset().remove(vega.truthy);
        this.view.change('table', changeSet).run();

        changeSet = vega.changeset().insert(this.data);
        this.view.change('table', changeSet).run();

        const dataLength = this.data.length;
        this.view.width(dataLength * 50).run();

        this.hideGraph = dataLength == 0;
        this.filtrando = false;
      });
  }
}
