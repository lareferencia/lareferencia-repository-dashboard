import { Component } from "@angular/core";
import { FieldWrapper } from '@ngx-formly/core';


@Component({
    selector: 'formly-field-wrapper',
    template: `
      <div class="grid">
        <label class="col-12 font-bold m-0 p-0">{{ props.label }}</label>
        <div class="col-12" >
          <ng-container #fieldComponent></ng-container>
        </div>
        <span class="text-xs">{{ props.description }}</span>
      </div>
    `, 

})
export class SimpleFieldWrapper extends FieldWrapper{}