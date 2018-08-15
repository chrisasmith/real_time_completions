import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {WellsService} from '../shared/services/wells.service';

@Injectable()
export class WellsResolver {
  constructor(private wellService: WellsService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this.wellService.getWells(route.params.asset).pipe(map(data => data.wells));
  }
}
