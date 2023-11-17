import { Component, OnInit } from '@angular/core';
import { filter, tap, switchMap } from 'rxjs/operators';

import { MenuService } from 'src/app/core/services/menu.service';

import { Menu } from 'src/app/shared/models/menu.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public activeRepository: string;
  public isLoading = true;

  public menuList: Menu[];
  public selectedMenu: Menu;
  public filteredMenus: Menu[] | undefined;

  constructor( 
    private menuService: MenuService,
    private router: Router) { }

  ngOnInit(): void {

   this.isLoading = true;

    this.menuService.menu.pipe(
      
      filter((menu: Menu[]) => menu.length > 0),
      tap((menu: Menu[]) => {
        this.menuList = menu;
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


  filterMenu(event: any) {
    const filtered: any[] = [];
    const query = event.query.toLowerCase();
  
    for (let i = 0; i < this.menuList.length; i++) {
      const menu = this.menuList[i];
      if (menu.name.toLowerCase().includes(query)) {
        filtered.push(menu);
      }
    }
  
    this.filteredMenus = filtered;
  }

  onSelectItem(menuItem: Menu) {
    console.log(menuItem);
    this.menuService.activeRepo.next(menuItem);
    localStorage.setItem('activeRepository', JSON.stringify(menuItem));
    this.router.navigate([`${menuItem.acronym}/harvesting`]);
    
    
  }

};