import { Component, OnInit } from '@angular/core';

import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/core/services/app-config.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit {
  
  public activeRepository: string;
  public harvestingConentId: number;
  public isMobileMenu = true;
  public isMenuOpen = false;
  public logoutError = false;

  constructor( 
    private menuService: MenuService,
    private harvestingService: HarvestingService,
    private authenticationService: AuthenticationService,
    private appConfig: AppConfigService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.menuService.activeRepo
      .subscribe( ({acronym}) => {
        this.activeRepository = acronym;
        this.loadLastValidation()
      });

      this.isMobileMenu = window.innerWidth < 570;
      window.addEventListener('resize', () => {
        this.isMobileMenu = window.innerWidth < 570;
      });

      this.menuService.isMenuOpen
        .subscribe( (isMenuOpen) => {
          this.isMenuOpen = isMenuOpen;
        });
  }

  loadLastValidation(){
    if(!this.activeRepository) return;

    this.harvestingService.getHarvestingLastGoodKnowByAcronym(this.activeRepository)
      .subscribe((harvesginContent) =>{
        this.harvestingConentId = harvesginContent.id;
      });
  }

  async logout(){
    this.logoutError = false;
    try {
      await this.authenticationService.logout();
      localStorage.removeItem('activeRepository');
      await this.router.navigate(['/login']);
    } catch {
      this.logoutError = true;
    }
  }

  isModuleActive( module:string ){
    return this.appConfig.getModuleStatus(module); 
  }
}
