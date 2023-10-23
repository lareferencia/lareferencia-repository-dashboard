import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { HttpClient } from '@angular/common/http';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';


@Component({
  selector: 'principal-form',
  templateUrl: './principal-form.component.html',
  styleUrls: ['./principal-form.component.css']
})
export class PrincipalFormComponent  {
 
  form: FormGroup;
  model: any;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];

  constructor(private formlyJsonschema: FormlyJsonschema, private http: HttpClient)
  {this.loadExample() }
  
  loadExample(){
    this.http.get<any>('assets/data/prueba.json').subscribe((schema) => {
      
      console.log(schema);
      this.fields = [this.formlyJsonschema.toFieldConfig(schema)];
      this.form = new FormGroup({});
      this.model = {};
      this.options = {};
    });
  }
  submit() {
    alert(JSON.stringify(this.model));
  }
}