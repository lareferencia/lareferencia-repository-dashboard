import { Component, OnInit } from '@angular/core';

import { MenuService } from './core/services/menu.service';
import { HarvestingService } from './core/services/harvesting.service';
import { AuthenticationService } from './core/services/authentication.service';

import { Menu } from './shared/models/menu.model';
import { HarvestingList } from './shared/models/harvesting-list.model';
import { Harvesting } from './shared/models/harvesting.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  public repositoriesMenu: Menu[] = [];
  public admUser = false;
 

  constructor(
    private menuService: MenuService,
    private harvestingService: HarvestingService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.admUser = this.authenticationService.isAdmUser();
    this.harvestingService.getHarvestingList()
      .subscribe((harvestingList) => {
        this.resultHandler(harvestingList);
      });
    };

  private resultHandler(harvestingList: HarvestingList ) {
    harvestingList.content.forEach((harvesting: Harvesting) => {
      this.repositoriesMenu.push({
        id: harvesting.id,
        name: harvesting.name,
        acronym: harvesting.acronym,
      });
    });    
    
    this.repositoriesMenu = this.repositoriesMenu
      .sort((a, b) => +(a.name > b.name) || -(a.name < b.name));

    if ( this.repositoriesMenu.length === harvestingList.content.length ) {
      this.menuService.menu.next(this.repositoriesMenu);

      // Set active repository by local storage
      const activeRepository = localStorage.getItem('activeRepository');
      if (activeRepository) return this.menuService.activeRepo.next(JSON.parse(activeRepository));

      // Set active repository by first repository if local storage is empty
      this.menuService.activeRepo.next(this.repositoriesMenu[0]);
    };
  };
}
