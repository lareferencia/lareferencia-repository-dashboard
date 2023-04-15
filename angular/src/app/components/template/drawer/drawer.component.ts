import { Component, OnInit } from '@angular/core';
import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { switchMap, tap, filter } from 'rxjs/operators';

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
  ) { }

  ngOnInit(): void {

    this.menuService.activeRepo.pipe(
      filter((activeRepo) => activeRepo.id > 0),
      tap((activeRepo) => {
        this.activeRepository = activeRepo.acronym;
      }),
      switchMap(({acronym}) => this.harvestingService.getHarvestingLastGoodKnowByAcronym(acronym)))

      .subscribe((resp) => {
        this.harvestingConentId = resp.id;
    })
  }
 
}
