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

  constructor(private navService: NavService, private router: Router) {
    this.repositories = [{ description: 'Fiocruz', showSubmenu: false }, { description: 'Uninove', showSubmenu: false }];
  }

  ngOnInit(): void {}

  get harvestingID(): number {
    return this.navService.navData.harvestingID;
  }

  get acronym(): string {
    return this.navService.navData.acronym;
  }

  menuClick(e: Menu) {
    this.repositories.forEach((x) => {
      if (x.description == e.description) x.showSubmenu = !x.showSubmenu;
    });
  }
}
