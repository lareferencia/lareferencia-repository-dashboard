import { BrokerEventsFilter } from './../../../shared/models/broker-events-filter.model';
import { BrokerService } from 'src/app/core/services/broker.service';
import { HarvestingService } from '../../../core/services/harvesting.service';
import { Menu } from '../../../shared/models/menu.model';
import { NavService } from '../../../core/services/nav.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  isExpanded = true;
  isExpandedFio = true;
  showSubmenu: boolean = false;
  showSubmenuFio: boolean = false;
  repositoriesMenu: Menu[] = [];
  filter: BrokerEventsFilter = {
    pageSize: 1,
    pageNumber: 0,
  };

  constructor(
    private navService: NavService,
    private router: Router,
    private harvestingService: HarvestingService,
    private brokerService: BrokerService
  ) {}

  ngOnInit(): void {
    this.harvestingService.getHarvestingList().subscribe((harvestingList) => {
      harvestingList.content.map((x) =>
        this.brokerService
          .getEventsByAcronym(x.acronym, this.filter)
          .subscribe((brokerEvents) => {
            this.repositoriesMenu.push({
              description: x.acronym,
              showSubmenu: false,
              hasBroker: brokerEvents.content.length > 0,
            });
            this.repositoriesMenu = this.repositoriesMenu.sort((a, b) => +(a.description > b.description) || -(a.description < b.description));
          })
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
      .subscribe((harvestingContent) => {
        this.router.navigate([`${acronym}/validation/${harvestingContent.id}`]);
      });
  }

  menuClick(e: Menu) {
    this.repositoriesMenu.forEach((x) => {
      if (x.description == e.description) x.showSubmenu = !x.showSubmenu;
    });
  }
}
