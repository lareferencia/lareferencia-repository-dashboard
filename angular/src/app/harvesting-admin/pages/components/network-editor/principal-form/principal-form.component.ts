import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormFieldJSON } from '../form.interface';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'principal-form',
  templateUrl: './principal-form.component.html',
  styleUrls: ['./principal-form.component.css']
})
export class PrincipalFormComponent implements OnChanges {
  public dynamicForm: FormGroup; 
  @Input() formFields: FormFieldJSON[] = [];
  

  constructor(private fb: FormBuilder) { }
  
  ngOnChanges(changes: SimpleChanges) {

    if (changes.formFields) {
      this.dynamicForm = this.fb.group({});
      this.setDynamicForm(this.formFields);
    }
  }

  setDynamicForm(controls: FormFieldJSON[]) {
    for (const control of controls) {
      this.dynamicForm.addControl(control.name, this.fb.control(control.value));
    }
  }

  saveForm() {
    console.log(this.dynamicForm.value);
  }
}