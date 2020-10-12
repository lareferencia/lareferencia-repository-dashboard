import { Component, OnInit, Input } from '@angular/core';
import { View } from 'vega';
import { Validation } from 'src/app/shared/validation.model';
declare const vega: any;

@Component({
  selector: 'app-conformity-chart',
  templateUrl: './conformity-chart.component.html',
  styleUrls: ['./conformity-chart.component.css'],
})
export class ConformityChartComponent implements OnInit {
  @Input() validation: Validation;

  chartDef = {
    name: 'radar',
    path: './assets/charts/radar.json',
  };

  constructor() {}

  ngOnInit(): void {}

  public handleChart(chartData: View) {
    const data = this.validation.rulesByID.map((result) => {
      return {
        key: `${result.ruleID}`,
        value: result.validCount,
        category: 0,
        mandatory: result.mandatory,
      };
    });

    const changeSet = vega.changeset().insert(data);
    chartData.change('table', changeSet).run();
  }
}
