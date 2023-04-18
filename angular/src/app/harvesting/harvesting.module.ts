import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HarvestingRoutingModule } from './harvesting-routing.module';
import { HarvestingComponent } from './pages/harvesting/harvesting.component';
import { HarvestingTableComponent } from './components/harvesting-table/harvesting-table.component';
import { HarvestingSourceComponent } from './components/harvesting-source/harvesting-source.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { HarvestingChartFilterModule } from './components/harvesting-chart-filter/harvesting-chart-filter.module';
import { HarvestingChartComponent } from './components/harvesting-chart/harvesting-chart.component';


@NgModule({
  declarations: [
    HarvestingComponent,
    HarvestingTableComponent,
    HarvestingSourceComponent,
    HarvestingChartComponent
  ],
  imports: [
    CommonModule,
    HarvestingRoutingModule,
    SharedModule,
    MaterialModule,
    HarvestingChartFilterModule,
  ],
  exports: [HarvestingChartComponent],
})
export class HarvestingModule { }
