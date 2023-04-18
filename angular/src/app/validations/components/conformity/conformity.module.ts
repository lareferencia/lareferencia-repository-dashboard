import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ConformityChartComponent } from './conformity-chart/conformity-chart.component';
import { ConformityGroupedChartComponent } from './conformity-grouped-chart/conformity-grouped-chart.component';
import { RuleModule } from '../rule/rule.module';

@NgModule({
  declarations: [
    ConformityChartComponent,
    ConformityGroupedChartComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    RuleModule
  ],
  exports: [ConformityGroupedChartComponent],
})
export class ConformityModule {}
