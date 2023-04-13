import { Component, OnInit } from '@angular/core';
import { NavService } from './core/services/nav.service';
import { Router } from '@angular/router';
import { HarvestingService } from './core/services/harvesting.service';
import { AuthenticationService } from './core/services/authentication.service';
import { Menu } from './shared/models/menu.model';
import { Harvesting } from './shared/models/harvesting.model';
// import { BrokerEvents } from './shared/models/broker-events.model';
import { MenuService } from './core/services/menu.service';
import { HarvestingList } from './shared/models/harvesting-list.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  repositoriesMenu: Menu[] = [];
  admUser = false;
  // filter: BrokerEventsFilter = {
  //   pageSize: 1,
  //   pageNumber: 0,
  // };

  constructor(
    private navService: NavService,
    private menuService: MenuService,
    private router: Router,
    private harvestingService: HarvestingService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.admUser = this.authenticationService.isAdmUser();
    this.harvestingService.getHarvestingList().subscribe((harvestingList) => {
        this.resultHandler(harvestingList);
          () => this.resultHandler(harvestingList )
      })
  }
  

  get harvestingID(): number {
    return this.navService.navData.harvestingID;
  }

  get acronym(): string {
    return this.navService.navData.acronym;
  }

  validationClick(acronym: string) {
    this.harvestingService
      .getHarvestingLastGoodKnowByAcronym(acronym)
      .subscribe(
        (harvestingContent) => {
          this.router.navigate([
            `${acronym}/validation/${harvestingContent.id}`,
          ]);
        },
        () => {
          this.router.navigate([`${acronym}/validation/-1`]);
        }
      );
  }
  // FUNCION QUE CARGA EL MENU DE REPOSITORIOS

  private resultHandler(harvestingList: HarvestingList ) {

    // formating data
    harvestingList.content.forEach((harvesting: Harvesting) => {
      this.repositoriesMenu.push({
        id: harvesting.id,
        name: harvesting.name,
        acronym: harvesting.acronym,
      });
    });    
    
    // Sort the menu alphabetically
    this.repositoriesMenu = this.repositoriesMenu.sort((a, b) => +(a.name > b.name) || -(a.name < b.name));
    // Wait for all requests to finish and then send the menu to the header component
    //TODO: Investigar que sucede si hay un solo repositorio
    if ( this.repositoriesMenu.length === harvestingList.content.length ) {
      this.menuService.menu.next(this.repositoriesMenu);
    }
  }
    
}
