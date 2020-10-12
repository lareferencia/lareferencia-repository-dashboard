import { Validation } from './../../shared/validation.model';
import { Component, OnInit, Input } from '@angular/core';
import { View } from 'vega';

@Component({
  selector: 'app-score-chart',
  templateUrl: './score-chart.component.html',
  styleUrls: ['./score-chart.component.css'],
})
export class ScoreChartComponent implements OnInit {
  @Input() validation: Validation;
  score: number;
  color: string;
  red = '#dc3545';
  orange = '#fa7d09';
  yellow = '#ffc107';
  green = '#28a745';

  chartDef = {
    name: 'gauge',
    path: './assets/charts/gauge.json',
  };

  constructor() {}

  ngOnInit(): void {
    this.calculateScore();

    this.score = this.score > 100 ? 100 : this.score;

    this.color =
      this.score >= 75
        ? this.green
        : this.score >= 50
        ? this.yellow
        : this.score >= 25
        ? this.orange
        : this.red;
  }

  private calculateScore() {
    const sumConformity = this.validation.rulesByID.reduce((acc, curr) => {
      return curr.mandatory
        ? acc + 2 * (curr.conformity / 100)
        : acc + curr.conformity / 100;
    }, 0);

    const sumWeightCompliance = this.validation.rulesByID.reduce(
      (acc, curr) => {
        return curr.mandatory ? acc + 2 : acc + 1;
      },
      0
    );

    const averageConformity =
      sumWeightCompliance > 0 ? sumConformity / sumWeightCompliance : 0;

    const invalidSize =
      this.validation.transformedSize - this.validation.validSize;

    const weigthValidRules =
      this.validation.validSize > 10000
        ? Math.log10(this.validation.validSize) / 4
        : 1;

    const weigthInvalidRules = 1 / Math.log10(10 + invalidSize);

    this.score =
      (averageConformity * 0.5 +
        weigthInvalidRules * 0.25 +
        weigthValidRules * 0.25) *
      100;
  }

  public handleChart(chartData: View) {
    chartData.signal('mainValue', this.score).run();
    chartData.signal('fillColor', this.color).run();
  }
}
