import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  items = [{
    label: 'Repositorios',
    items: [
        {label: 'Dashboard / Colombia', icourl: 'https://primeng.org'},
        {label: 'Dashboard / España', routerLink: ['/menu']},
        {label: 'Dashboard / Brasil', routerLink: ['/pagename'], queryParams: {'recent': 'true'}}
    ]
  }];

}
