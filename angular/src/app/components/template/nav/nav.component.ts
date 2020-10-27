import { HarvestingService } from './../../../services/harvesting.service';
import { Menu } from './../../../shared/menu.model';
import { NavService } from './../../../services/nav.service';
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
  repositories: Menu[];

  constructor(
    private navService: NavService,
    private router: Router,
    private harvestingService: HarvestingService
  ) {
    this.repositories = [
      { description: 'Fiocruz', showSubmenu: false },
      { description: 'Uninove', showSubmenu: false },
      { description: 'Ibict', showSubmenu: false },
      { description: 'UFSM', showSubmenu: false },
      { description: 'PUC-RS', showSubmenu: false },
      { description: 'UFES', showSubmenu: false },
      { description: 'UFSCar', showSubmenu: false },
    ];
  }

  ngOnInit(): void {}

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
    this.repositories.forEach((x) => {
      if (x.description == e.description) x.showSubmenu = !x.showSubmenu;
    });
  }
}
