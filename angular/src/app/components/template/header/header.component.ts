import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { Menu, MenuRepositorie } from 'src/app/shared/models/menu.model';
import { filter, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  menuRepositories: MenuRepositorie[] = [];
  activeRepository: string;

  constructor( private menuService: MenuService) { }

  ngOnInit(): void {
    this.menuService.menu.pipe(
      filter((menu: Menu[]) => menu.length > 0),
      tap((menu: Menu[]) => {

        this.menuRepositories = [
          {
            label: 'Repositories',
            items: menu.map(menuItem => (
              {
                label: menuItem.name,
                routerLink: ['/', menuItem.acronym],
                command: () => this.menuService.activeRepo.next(menuItem)
              }
            ))
          }
        ];
      }),
      switchMap((menu: Menu[]) => {

        this.menuService.activeRepo.next(menu[0]);
        return this.menuService.activeRepo;
      })
    ).subscribe((activeRepo: Menu) => {
      this.activeRepository = activeRepo.name;
    });
  }
}