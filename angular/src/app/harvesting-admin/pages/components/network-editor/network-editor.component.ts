import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-network-editor',
  templateUrl: './network-editor.component.html',
  styleUrls: ['./network-editor.component.css']
})
export class NetworkEditorComponent implements OnInit {

  constructor( private http: HttpClient) { }

  ngOnInit(): void {
    this.getFormFields();
  }
  getFormFields(){
    return this.http.get('./assets/data/prueba.json').subscribe(data => {
      console.log(data)
    });
  }
}
