import { Component } from '@angular/core';
import { MenuService } from '../core/services/menu.service';
import { HarvestingService } from '../core/services/harvesting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})


export class HomeComponent   {

  constructor( 
    private menuService: MenuService,
    private harvestingService: HarvestingService,
    private router: Router
  ) { }

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
}


  
