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

  constructor( private menuService: MenuService) { }

  ngOnInit(): void {
    // Get menu repositories
    this.menuService.menu.pipe(
      filter((menu: Menu[]) => menu.length > 0),
      tap((menu: Menu[]) => {

        // Set menu repositories, primeNG Menu format
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
        return this.menuService.activeRepo;
      })
      ).subscribe((activeRepo: Menu) => {
        // Set active repository, name to show in header
          this.activeRepository = activeRepo.name;
    });
  };
};