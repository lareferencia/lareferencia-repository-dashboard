import { AuthenticationService } from './../../../core/services/authentication.service';
import { BrokerEventsFilter } from './../../../shared/models/broker-events-filter.model';
import { BrokerService } from 'src/app/core/services/broker.service';
import { HarvestingService } from '../../../core/services/harvesting.service';
import { Menu } from '../../../shared/models/menu.model';
import { NavService } from '../../../core/services/nav.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Harvesting } from 'src/app/shared/models/harvesting.model';
import { BrokerEvents } from 'src/app/shared/models/broker-events.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  // isExpanded = true;
  // isExpandedFio = true;
  // showSubmenu: boolean = false;
  // showSubmenuFio: boolean = false;
  repositoriesMenu: Menu[] = [];
  admUser = false;
  filter: BrokerEventsFilter = {
    pageSize: 1,
    pageNumber: 0,
  };

  constructor(
    private navService: NavService,
    private router: Router,
    private harvestingService: HarvestingService,
    private brokerService: BrokerService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.admUser = this.authenticationService.isAdmUser();
    this.harvestingService.getHarvestingList().subscribe((harvestingList) => {
      harvestingList.content.map((harvesting) =>
        this.brokerService
          .getEventsByAcronym(harvesting.acronym, this.filter)
          .subscribe(
            (brokerEvents) => this.resultHandler(harvesting, brokerEvents),
            () => this.resultHandler(harvesting, null)
          )
      );
    });
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

  private resultHandler(harvesting: Harvesting, brokerEvents: BrokerEvents) {
    this.repositoriesMenu.push({
      description: harvesting.acronym,
      showSubmenu: false,
      hasBroker: brokerEvents?.content.length > 0,
    });
    this.repositoriesMenu = this.repositoriesMenu.sort((a, b) => +(a.description > b.description) || -(a.description < b.description));
  }

  menuClick(e: Menu) {
    this.repositoriesMenu.forEach((x) => {
      if (x.description == e.description) x.showSubmenu = !x.showSubmenu;
    });
  }
}
