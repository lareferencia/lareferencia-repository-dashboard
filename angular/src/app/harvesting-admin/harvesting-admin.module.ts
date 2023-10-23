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
import { ObjectTypeComponent } from "./pages/components/network-editor/form-types/object.type";
import { ArrayTypeComponent } from "./pages/components/network-editor/form-types/array.type";

export function minItemsValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should NOT have fewer than ${field.props.minItems} items`;
  }
  
  export function maxItemsValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should NOT have more than ${field.props.maxItems} items`;
  }
  
  export function minLengthValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should NOT be shorter than ${field.props.minLength} characters`;
  }
  
  export function maxLengthValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should NOT be longer than ${field.props.maxLength} characters`;
  }
  
  export function minValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be >= ${field.props.min}`;
  }
  
  export function maxValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be <= ${field.props.max}`;
  }
  
  export function multipleOfValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be multiple of ${field.props.step}`;
  }
  
  export function exclusiveMinimumValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be > ${field.props.step}`;
  }
  
  export function exclusiveMaximumValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be < ${field.props.step}`;
  }
  
  export function constValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be equal to constant "${field.props.const}"`;
  }
  
  export function typeValidationMessage({ schemaType }: any) {
    return `should be "${schemaType[0]}".`;
  }

  
@NgModule({
    declarations: [
        MainComponent,
        NetworksListTableComponent,
        ValidatorsFormComponent,
        NetworkEditorComponent,
        PrincipalFormComponent,
        ObjectTypeComponent,
        ArrayTypeComponent
    ],
    imports: [
        CommonModule,
        HarvestingAdminRoutingModule,
        PrimengMaterial,
        SharedModule,
        ReactiveFormsModule,
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
            ],
          }),
        ReactiveFormsModule,
        FormlyPrimeNGModule
        
    ],
})

export class HarvestingAdminModule {}