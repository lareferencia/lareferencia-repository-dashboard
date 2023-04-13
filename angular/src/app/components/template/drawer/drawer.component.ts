import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { Menu } from 'src/app/shared/models/menu.model';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit {
  activeRepository: string;
  harvestingConentId: number;

  constructor( 
    private menuService: MenuService,
    private harvestingService: HarvestingService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    //Subscribe to active repo changes
    this.menuService.activeRepo.subscribe((activeRepo: Menu) => {
    this.activeRepository = activeRepo?.acronym
    this.resultHandler(activeRepo?.acronym);
    });
  }
  //TODO: Revisat y refactorizar esto porque le pimer peticion falla.

  resultHandler(acronym: string) {
    this.harvestingService.getHarvestingLastGoodKnowByAcronym(acronym)
    .subscribe((harvestingContent) => {
      this.harvestingConentId = harvestingContent.id;
      console.log(this.harvestingConentId)
    });
  }
}
