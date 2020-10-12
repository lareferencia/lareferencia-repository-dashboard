import { Validation } from './../../shared/validation.model';
import { Component, OnInit, Input } from '@angular/core';
import { View } from 'vega';
declare const vega: any;

@Component({
  selector: 'app-conformity-grouped-chart',
  templateUrl: './conformity-grouped-chart.component.html',
  styleUrls: ['./conformity-grouped-chart.component.css'],
})
export class ConformityGroupedChartComponent implements OnInit {
  @Input() validation: Validation;

  chartDef = {
    name: 'grouped',
    path: './assets/charts/grouped.json',
  };

  constructor() {}

  ngOnInit(): void {}

  public handleChart(chartData: View) {
    const data = this.validation.rulesByID
      .filter((x) => x.mandatory)
      .sort((a, b) => a.conformity - b.conformity)
      .map((result) => {
        return {
          position: result.ruleID,
          value: result.conformity,
          rule: result.name,
        };
      });

    const changeSet = vega.changeset().insert(data);
    chartData.change('table', changeSet).run();
  }
}
