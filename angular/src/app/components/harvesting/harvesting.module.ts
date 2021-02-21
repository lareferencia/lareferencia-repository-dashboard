import { HarvestingTableComponent } from './harvesting-table/harvesting-table.component';
import { HarvestingSourceComponent } from './harvesting-source/harvesting-source.component';
import { HarvestingComponent } from './harvesting/harvesting.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { HarvestingChartComponent } from './harvesting-chart/harvesting-chart.component';
import { HarvestingChartFilterModule } from './harvesting-chart-filter/harvesting-chart-filter.module';

@NgModule({
  declarations: [
    HarvestingSourceComponent,
    HarvestingTableComponent,
    HarvestingComponent,
    HarvestingChartComponent,
  ],
  imports: [
    SharedModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HarvestingChartFilterModule,
  ],
  exports: [HarvestingChartComponent],
})
export class HarvestingModule {}
