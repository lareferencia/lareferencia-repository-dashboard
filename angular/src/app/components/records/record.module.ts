import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { RecordsTableComponent } from './records-table/records-table.component';
import { RecordInvalidComponent } from './record-invalid/record-invalid.component';
import { RecordsInvalidTableComponent } from './records-invalid-table/records-invalid-table.component';
import { RecordsValidTableComponent } from './records-valid-table/records-valid-table.component';
import { RecordValidComponent } from './record-valid/record-valid.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    RecordValidComponent,
    RecordInvalidComponent,
    RecordsValidTableComponent,
    RecordsInvalidTableComponent,
    RecordsTableComponent,
  ],
  imports: [
    SharedModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatInputModule,
    MatSortModule,
    MatButtonModule,
  ],
  exports: [
    RecordValidComponent,
    RecordInvalidComponent,
    RecordsValidTableComponent,
    RecordsInvalidTableComponent,
    RecordsTableComponent,
  ],
})
export class RecordModule {}
