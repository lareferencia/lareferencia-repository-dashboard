import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgModule } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { ConformityModule } from '../conformity/conformity.module';
import { OcurrenceModule } from '../occurrence/occurrence.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { ValidationTableComponent } from './validation-table/validation-table.component';
import { ValidationDetailComponent } from './validation-detail/validation-detail.component';
import { ValidationComponent } from './validation/validation.component';
import { RecordModule } from '../records/record.module';

@NgModule({
  declarations: [
    ValidationDetailComponent,
    ValidationTableComponent,
    ValidationComponent,
  ],
  imports: [
    SharedModule,
    MatDialogModule,
    OcurrenceModule,
    MatTableModule,
    MatSortModule,
    MatProgressBarModule,
    RouterModule,
    MatPaginatorModule,
    ConformityModule,
    RecordModule,
  ],
})
export class ValidationModule {}
