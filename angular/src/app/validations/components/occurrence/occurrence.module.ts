import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';

import { InvalidOccurenceTableComponent } from './invalid-occurence-table/invalid-occurence-table.component';
import { ValidOccurenceTableComponent } from './valid-occurence-table/valid-occurence-table.component';

@NgModule({
  declarations: [
    InvalidOccurenceTableComponent, 
    ValidOccurenceTableComponent
  ],
  imports: [
    SharedModule,
    MaterialModule
  ],
  exports: [
    InvalidOccurenceTableComponent, 
    ValidOccurenceTableComponent
  ],
})
export class OcurrenceModule {}
