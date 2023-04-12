import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Menu } from 'src/app/shared/models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private _menuData = new BehaviorSubject<Menu[]>([]);

  constructor() {}

  get menu(): BehaviorSubject<Menu[]> {
    return this._menuData;
  }

  set menu(menuData: BehaviorSubject<Menu[]>) {
    this._menuData = menuData;
  }
}