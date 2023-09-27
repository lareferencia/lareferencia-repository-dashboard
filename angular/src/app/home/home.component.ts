import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuService } from '../core/services/menu.service';
import { HarvestingService } from '../core/services/harvesting.service';
import { AppConfigService } from '../core/services/app-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})


export class HomeComponent implements OnInit {

  statisticsModuleIsActive: boolean; 

  constructor( 
    private menuService: MenuService,
    private harvestingService: HarvestingService,
    private router: Router,
    private appConfig: AppConfigService
  ) {}

  ngOnInit(): void {
    this.statisticsModuleIsActive = this.appConfig.getModuleStatus('statistics');
  }

  onHarvestingNavigate(){
    this.menuService.activeRepo
      .subscribe( ({acronym}) => {
        this.router.navigate([`${acronym}/harvesting`]);
      });
  }

  onValidationNavigate(){
    this.menuService.activeRepo
    .subscribe( ({acronym}) => {
      this.harvestingService.getHarvestingLastGoodKnowByAcronym(acronym)
        .subscribe(({id}) =>{
          this.router.navigate([`${acronym}/validation/${id}`])
        }, () =>{this.router.navigate([`${acronym}/validation/-1`])
      })
    });
  }
  onStatisticsNavigate(){
    this.router.navigate(['statistics']);
  }
}


  
