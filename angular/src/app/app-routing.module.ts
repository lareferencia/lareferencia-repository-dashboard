import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordValidComponent } from './views/record-valid/record-valid.component';
import { RecordInvalidComponent } from './views/record-invalid/record-invalid.component';
import { HarvestingComponent } from './views/harvesting/harvesting.component';
import { HomeComponent } from './views/home/home.component';
import { ValidationComponent } from './views/validation/validation.component';
import { AuthenticationService } from './core/services/authentication.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthenticationService],
  },
  {
    path: ':acronym/validation/:harvestingID',
    component: ValidationComponent,
    canActivate: [AuthenticationService],
  },
  {
    path: ':acronym',
    component: HarvestingComponent,
    canActivate: [AuthenticationService],
  },
  {
    path: ':acronym/validation/:harvestingID/invalid_rule/:ruleID',
    component: RecordInvalidComponent,
    canActivate: [AuthenticationService],
  },
  {
    path: ':acronym/validation/:harvestingID/valid_rule/:ruleID',
    component: RecordValidComponent,
    canActivate: [AuthenticationService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
