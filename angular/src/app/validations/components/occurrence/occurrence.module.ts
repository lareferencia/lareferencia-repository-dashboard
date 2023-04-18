import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { InvalidOccurenceTableComponent } from './invalid-occurence-table/invalid-occurence-table.component';
import { ValidOccurenceTableComponent } from './valid-occurence-table/valid-occurence-table.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    InvalidOccurenceTableComponent, 
    ValidOccurenceTableComponent
  ],
  imports: [
    SharedModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule],
  exports: [
    InvalidOccurenceTableComponent, 
    ValidOccurenceTableComponent
  ],
})
export class OcurrenceModule {}
