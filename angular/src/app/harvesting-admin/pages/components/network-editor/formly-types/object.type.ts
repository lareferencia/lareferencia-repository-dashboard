import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-object-type',
  template: `
    <div class="mb-3">
      <div class="mb-3">
        <legend *ngIf="props.label">{{ props.label }}</legend>
        <p *ngIf="props.description">{{ props.description }}</p>
        <hr>
      </div>
      <div class="grid p-3">
        <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
          <formly-validation-message [field]="field"></formly-validation-message>
        </div>
        <formly-field class="col-4" *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
      </div>
    </div>
  `,
})
export class ObjectTypeComponent extends FieldType {}