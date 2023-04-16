import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Menu } from 'src/app/shared/models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private _menuData = new BehaviorSubject<Menu[]>([]);
  private _activeRepo = new BehaviorSubject<Menu>({ name: '', acronym: '', id:0 });

  constructor() {}

  get menu(): BehaviorSubject<Menu[]> {
    return this._menuData;
  }

  set menu(menuData: BehaviorSubject<Menu[]>) {
    this._menuData = menuData;
    console.log('menuData', this._menuData);
  }

  get activeRepo(): BehaviorSubject<Menu> {
    return this._activeRepo;
  }

  set activeRepo(activeRepo: BehaviorSubject<Menu>) {
    this._activeRepo = activeRepo;
    console.log('activeRepo', this._activeRepo)
  }
}