import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { InvalidOccurenceTableComponent } from './invalid-occurence-table/invalid-occurence-table.component';
import { ValidOccurenceTableComponent } from './valid-occurence-table/valid-occurence-table.component';
import { PrimengMaterial } from 'src/app/primeng-material/primeng-material.module';

@NgModule({
  declarations: [
    InvalidOccurenceTableComponent, 
    ValidOccurenceTableComponent
  ],
  imports: [
    SharedModule,
    PrimengMaterial
  ],
  exports: [
    InvalidOccurenceTableComponent, 
    ValidOccurenceTableComponent
  ],
})
export class OcurrenceModule {}
