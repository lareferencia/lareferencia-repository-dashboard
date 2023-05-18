import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HarvestingRoutingModule } from './harvesting-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { HarvestingComponent } from './pages/harvesting/harvesting.component';
import { HarvestingTableComponent } from './components/harvesting-table/harvesting-table.component';
import { HarvestingSourceComponent } from './components/harvesting-source/harvesting-source.component';
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
    MaterialModule,
    SharedModule,
  ],
  exports: [HarvestingChartComponent],
})
export class HarvestingModule { }
