import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MainComponent } from "./pages/main.component";
import { HarvestingAdminRoutingModule } from "./harvesting-admin-routing.module";
import { NetworksListTableComponent } from './pages/components/networks-list-table/networks-list-table.component';
import { PrimengMaterial } from "../primeng-material/primeng-material.module";
import { SharedModule } from "../shared/shared.module";
import { ValidatorsFormComponent } from './pages/components/validators-form/validators-form.component';
import { NetworkEditorComponent } from './pages/components/network-editor/network-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrincipalFormComponent } from './pages/components/network-editor/principal-form/principal-form.component';
import { FormlyPrimeNGModule } from "@ngx-formly/primeng";
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { ObjectTypeComponent } from "./pages/components/network-editor/formly-types/object.type";
import { ArrayTypeComponent } from "./pages/components/network-editor/formly-types/array.type";
import { constValidationMessage, exclusiveMaximumValidationMessage, exclusiveMinimumValidationMessage, maxItemsValidationMessage, maxLengthValidationMessage, maxValidationMessage, minItemsValidationMessage, minLengthValidationMessage, minValidationMessage, multipleOfValidationMessage, typeValidationMessage } from "./pages/util/error-messages";
import { SimpleFieldWrapper } from "./pages/components/network-editor/formly-wrappers/field.wrapper";
import { NetworksDashboardComponent } from "./pages/components/networks-list-table/components/networks-dashboard/networks-dashboard.component";


@NgModule({
    declarations: [
        MainComponent,
        NetworksListTableComponent,
        ValidatorsFormComponent,
        NetworkEditorComponent,
        PrincipalFormComponent,
        ObjectTypeComponent,
        ArrayTypeComponent,
        SimpleFieldWrapper,
    ],
    imports: [
        CommonModule,
        HarvestingAdminRoutingModule,
        PrimengMaterial,
        SharedModule,
        ReactiveFormsModule,
        NetworksDashboardComponent,
        FormlyModule.forRoot({
            validationMessages: [
              { name: 'required', message: 'This field is required' },
              { name: 'type', message: typeValidationMessage },
              { name: 'minLength', message: minLengthValidationMessage },
              { name: 'maxLength', message: maxLengthValidationMessage },
              { name: 'min', message: minValidationMessage },
              { name: 'max', message: maxValidationMessage },
              { name: 'multipleOf', message: multipleOfValidationMessage },
              { name: 'exclusiveMinimum', message: exclusiveMinimumValidationMessage },
              { name: 'exclusiveMaximum', message: exclusiveMaximumValidationMessage },
              { name: 'minItems', message: minItemsValidationMessage },
              { name: 'maxItems', message: maxItemsValidationMessage },
              { name: 'uniqueItems', message: 'should NOT have duplicate items' },
              { name: 'const', message: constValidationMessage },
              { name: 'enum', message: `must be equal to one of the allowed values` },
            ],
            types: [
              { name: 'object', component: ObjectTypeComponent },
              { name: 'array', component: ArrayTypeComponent },
              { name: 'string', wrappers: ['simple-form-field'] },
              { name: 'enum', wrappers: ['simple-form-field'] },
            ],
            wrappers: [
              { name: 'simple-form-field', component: SimpleFieldWrapper },
            ],
          }),
        ReactiveFormsModule,
        FormlyPrimeNGModule
        
    ],
})

export class HarvestingAdminModule {}