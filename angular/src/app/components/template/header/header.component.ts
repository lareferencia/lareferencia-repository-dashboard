import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { Menu } from 'src/app/shared/models/menu.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //TODO: Create the interface for the menu

  menuRepositories: any[] = [];
  activeRepository: String;

  constructor( private menuService: MenuService) { }

  ngOnInit(): void {
    this.menuService.menu.subscribe((menu: Menu[]) => {

      //Format that primeng menu component needs
      this.menuRepositories = 
      [
        {
        label: 'Repositorios',
        items: menu.map(menuItem =>(
          {
            label: `Dashboard / ${menuItem.name}`,
            routerLink: ['/', menuItem.acronym],
            command: () => this.menuService.activeRepo.next(menuItem)
          }))
        }
      ];
      //Default repo, always the first in the array
      this.menuService.activeRepo.next(menu[0]);

      //Subscribe to active repo changes
      this.menuService.activeRepo.subscribe((activeRepo: Menu) => {
      this.activeRepository = activeRepo?.name;
      });
    });
  }
}
