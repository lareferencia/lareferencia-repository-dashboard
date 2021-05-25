import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from './../../shared/shared.module';
import { BrokerComponent } from './broker/broker.component';
import { BrokerEventsTableComponent } from './broker-events-table/broker-events-table.component';

@NgModule({
  declarations: [BrokerComponent, BrokerEventsTableComponent],
  imports: [
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [BrokerComponent],
})
export class BrokerModule {}
