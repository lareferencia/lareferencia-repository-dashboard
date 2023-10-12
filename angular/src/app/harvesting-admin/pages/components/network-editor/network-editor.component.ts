import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormData, FormFieldJSON } from './form.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-network-editor',
  templateUrl: './network-editor.component.html',
  styleUrls: ['./network-editor.component.css']
})
export class NetworkEditorComponent implements OnInit {

  public formFields: FormFieldJSON[] = [];
  public dynamicForm: FormGroup; 


  constructor( private fb: FormBuilder, private http: HttpClient,) { }
  
  ngOnInit(): void {
    this.dynamicForm = this.fb.group({})
    this.getFormFields().subscribe( resp => {
      this.formFields = resp.data;
      this.setDynamicForm(resp.data);
    });
  }
  getFormFields(): Observable<FormData>{
    return this.http.get<FormData>('./assets/data/prueba.json');
  }

  setDynamicForm( controls: FormFieldJSON[] ){
    for(const control of controls){
      this.dynamicForm.addControl(control.name, this.fb.control(control.value))
    }
  }

  saveForm() {
    console.log(this.dynamicForm.value);
  }
}
