import { HarvestingTableComponent } from './harvesting-table/harvesting-table.component';
import { HarvestingSourceComponent } from './harvesting-source/harvesting-source.component';
import { HarvestingComponent } from './harvesting/harvesting.component';
import { ValidationModule } from './../validation/validation.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    HarvestingSourceComponent,
    HarvestingTableComponent,
    HarvestingComponent,
  ],
  imports: [
    SharedModule,
    ValidationModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class HarvestingModule {}
