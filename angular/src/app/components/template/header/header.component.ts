import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { Menu } from 'src/app/shared/models/menu.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menuRepositories: any[] = [];

  constructor( private menuService: MenuService) { }

  ngOnInit(): void {
    this.menuService.menu.subscribe((menu: Menu[]) => {
      this.menuRepositories = 
      [
        {
          label: 'Repositorios',
          items: menu.map(menuItem =>(
            {
              label: menuItem.description + ' / Dashboard',
              routerLink: ['/', menuItem.description]
            }
          ))
        }
      ]
      console.log(this.menuRepositories)
    });
  }


  // items = [{
  //   label: 'Repositorios',
  //   items: [
  //       {label: 'Dashboard / Colombia', icourl: 'https://primeng.org'},
  //       {label: 'Dashboard / España', routerLink: ['/menu']},
  //       {label: 'Dashboard / Brasil', routerLink: ['/pagename'], queryParams: {'recent': 'true'}}
  //   ]
  // }];

}
