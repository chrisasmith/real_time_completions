import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class NavPageTabsService {
  private resized: Subject<any>;

  get toogled(): Subject<any> {
    return this.resized;
  }

  constructor() {
    this.resized = new Subject<any>();
  }

  public sidenavToggled(): void {
    this.resized.next(true);
  }
}
