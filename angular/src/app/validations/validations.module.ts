import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationsRoutingModule } from './validations-routing.module';
import { ValidationDetailComponent } from './components/validation-detail/validation-detail.component';
import { ValidationTableComponent } from './components/validation-table/validation-table.component';
import { ValidationComponent } from './pages/validation.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { RecordModule } from './components/records/record.module';
import { ConformityModule } from './components/conformity/conformity.module';
import { OcurrenceModule } from './components/occurrence/occurrence.module';


@NgModule({
  declarations: [
    ValidationComponent,
    ValidationDetailComponent,
    ValidationTableComponent,
  ],
  imports: [
    CommonModule,
    ValidationsRoutingModule,
    SharedModule,
    MaterialModule,
    RecordModule,
    ConformityModule,
    OcurrenceModule
  ]
})
export class ValidationsModule { }