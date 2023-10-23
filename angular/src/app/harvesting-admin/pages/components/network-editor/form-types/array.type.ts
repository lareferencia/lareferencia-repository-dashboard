import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'formly-array-type',
  template: `
    <div class="mb-3">
      <legend class="m-0 p-0" *ngIf="props.label">{{ props.label }}</legend>
      <hr class="mt-1">
      <p *ngIf="props.description">{{ props.description }}</p>
      <div class="d-flex flex-row-reverse">
        <button class="btn btn-primary" type="button" (click)="add()">+</button>
      </div>

      <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>

      <div *ngFor="let field of field.fieldGroup; let i = index"
        class="flex gap-3">
        <formly-field [field]="field"></formly-field>
        <div *ngIf="field.props.removable !== false" class="flex flex-column justify-content-end p-1">
          <button class="btn btn-danger" type="button" (click)="remove(i)">-</button>
        </div>
      </div>
    </div>
  `,
})
export class ArrayTypeComponent extends FieldArrayType {}