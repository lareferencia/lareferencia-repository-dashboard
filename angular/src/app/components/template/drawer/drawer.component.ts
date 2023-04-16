import { Component, OnInit } from '@angular/core';

import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit {
  public activeRepository: string;
  public harvestingConentId: number;

  constructor( 
    private menuService: MenuService,
    private harvestingService: HarvestingService,
  ) { }

  ngOnInit(): void {

    this.menuService.activeRepo
      .subscribe( ({acronym}) => {

        this.activeRepository = acronym;

        this.harvestingService.getHarvestingLastGoodKnowByAcronym(acronym)
          .subscribe((harvesginContent) =>{

            this.harvestingConentId = harvesginContent.id;
          }, (error) => console.log('error de validacion'))
      })
  }
}