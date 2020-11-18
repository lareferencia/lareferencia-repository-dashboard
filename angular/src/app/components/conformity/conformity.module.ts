import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConformityChartComponent } from './conformity-chart/conformity-chart.component';
import { ConformityGroupedChartComponent } from './conformity-grouped-chart/conformity-grouped-chart.component';
import { RuleModule } from '../rule/rule.module';

@NgModule({
  declarations: [ConformityChartComponent, ConformityGroupedChartComponent],
  imports: [SharedModule, MatTableModule, MatPaginatorModule, RuleModule],
  exports: [ConformityGroupedChartComponent],
})
export class ConformityModule {}
