import { RecordValidComponent } from './views/record-valid/record-valid.component';
import { RecordInvalidComponent } from './views/record-invalid/record-invalid.component';
import { HarvestingComponent } from './views/harvesting/harvesting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './views/home/home.component';
import { ValidationComponent } from './views/validation/validation.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'validation/:harvestingID',
    component: ValidationComponent,
  },
  {
    path: ':acronym',
    component: HarvestingComponent
  },
  {
    path: 'validation/:harvestingID/invalid_rule/:ruleID',
    component: RecordInvalidComponent
  },
  {
    path: 'validation/:harvestingID/valid_rule/:ruleID',
    component: RecordValidComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
