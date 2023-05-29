import { Component, OnInit } from '@angular/core';
import { filter, tap, switchMap } from 'rxjs/operators';

import { MenuService } from 'src/app/core/services/menu.service';

import { Menu, MenuRepositorie } from 'src/app/shared/models/menu.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public menuRepositories: MenuRepositorie[] = [];
  public activeRepository: string;
  public isLoading = true;

  constructor( private menuService: MenuService) { }

  ngOnInit(): void {

   this.isLoading = true;

    this.menuService.menu.pipe(
      
      filter((menu: Menu[]) => menu.length > 0),
      tap((menu: Menu[]) => {
        
        this.menuRepositories = [
          {
            label: 'Repositories',
            items: menu.map(menuItem => (
              {
                label: menuItem.name,
                routerLink: [`${menuItem.acronym}/harvesting`],
                command: () => {
                  this.menuService.activeRepo.next(menuItem);
                  localStorage.setItem('activeRepository', JSON.stringify(menuItem));
                }
              }
            ))
          }
        ];
        this.isLoading = false;
      }),
      switchMap((menu: Menu[]) => {
        return this.menuService.activeRepo;
      })
      ).subscribe((activeRepo: Menu) => {
        this.activeRepository = activeRepo.name;  
    });
  };


  toggleMenu(){
    this.menuService.toggleMenuOpen();
  }
};