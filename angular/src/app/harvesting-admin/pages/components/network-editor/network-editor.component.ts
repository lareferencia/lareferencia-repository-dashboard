import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormData, FormFieldJSON } from './form.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-network-editor',
  templateUrl: './network-editor.component.html',
  styleUrls: ['./network-editor.component.css']
})
export class NetworkEditorComponent implements OnInit {
  public formFields: FormFieldJSON[] = [];
  
  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {

  this.getFormFields().subscribe( resp => {
      this.formFields = resp.data;
    });
  }
  getFormFields(): Observable<FormData>{
    return this.http.get<FormData>('./assets/data/prueba.json');
  }

}
