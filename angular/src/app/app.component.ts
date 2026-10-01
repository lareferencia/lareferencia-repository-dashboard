import { Component, OnInit } from '@angular/core';

import { MenuService } from './core/services/menu.service';
import { HarvestingService } from './core/services/harvesting.service';
import { Menu } from './shared/models/menu.model';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  public repositoriesMenu: Menu[] = [];
  public isRepositoriesEmpty = false;
  public isLoadingRepositories = true;
  public repositoryLoadError = false;
 

  constructor(
    private menuService: MenuService,
    private harvestingService: HarvestingService,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authenticationService.user$.subscribe(user => {
      if (user) this.loadRepositories();
      else {
        this.repositoriesMenu = [];
        this.isLoadingRepositories = false;
        this.isRepositoriesEmpty = false;
        this.menuService.menu.next([]);
      }
    });
  }

  loadRepositories(): void {
    this.isLoadingRepositories = true;
    this.repositoryLoadError = false;
    this.harvestingService.getAllHarvestings().subscribe({
      next: harvestings => {
        this.repositoriesMenu = harvestings.map(item => ({ id: item.id, name: item.name, acronym: item.acronym }))
          .sort((a, b) => a.name.localeCompare(b.name));
        this.isRepositoriesEmpty = this.repositoriesMenu.length === 0;
        this.menuService.menu.next(this.repositoriesMenu);
        if (!this.repositoriesMenu.length) return;
        const saved = localStorage.getItem('activeRepository');
        let savedMenu: Menu | undefined;
        try {
          const savedId = saved ? JSON.parse(saved)?.id : undefined;
          savedMenu = this.repositoriesMenu.find(item => item.id === savedId);
        } catch { localStorage.removeItem('activeRepository'); }
        this.menuService.activeRepo.next(savedMenu || this.repositoriesMenu[0]);
      },
      error: () => {
        this.isRepositoriesEmpty = false;
        this.repositoryLoadError = true;
        this.isLoadingRepositories = false;
      },
      complete: () => { this.isLoadingRepositories = false; },
    });
  }
}
