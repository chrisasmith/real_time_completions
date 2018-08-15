import { Injectable } from '@angular/core';
import { MENU } from './menu';

import { MenuItem } from './menu-item';


export const MENUITEMS: MenuItem[] = MENU;

@Injectable()
export class MenuService {

  getMenuItems(): Promise<MenuItem[]> {
    return Promise.resolve(MENUITEMS);
  }

}
