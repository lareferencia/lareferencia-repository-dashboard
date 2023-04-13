import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { Menu } from 'src/app/shared/models/menu.model';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit {
  activeRepository: String;

  constructor( private menuService: MenuService) { }

  ngOnInit(): void {

    //Subscribe to active repo changes
    this.menuService.activeRepo.subscribe((activeRepo: Menu) => {
      this.activeRepository = activeRepo?.acronym;
      console.log(this.activeRepository)
    });
  }

}
