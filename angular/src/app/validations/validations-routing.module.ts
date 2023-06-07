import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecordInvalidComponent } from './components/records/record-invalid/record-invalid.component';
// import { RecordValidComponent } from './components/records/record-valid/record-valid.component';
import { ValidationComponent } from './pages/validation.component';

const routes: Routes = [
    {
        path: 'validation/:harvestingID',
        component: ValidationComponent,
    },
    {
        path: 'validation/:harvestingID/invalid_rule/:ruleID',
        component: RecordInvalidComponent
    },
    // {
    //     path: 'validation/:harvestingID/valid_rule/:ruleID',
    //     component: RecordValidComponent
    // }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],

})
export class ValidationsRoutingModule { }
