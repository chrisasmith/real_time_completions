import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {WellsService} from '../shared/services/wells.service';

@Injectable()
export class HasWellGuard implements CanActivate {
  constructor(private wellService: WellsService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const asset = route.params.asset;
    return this.wellService.getWells(asset).pipe(tap(data => {
      const wells = data.wells || [];
      const well = wells[0];
      const wellApi = well ? well.api_no_10 : null;
      if (wellApi !== null) {
        this.router.navigate([ asset, 'treatment-plot', wellApi ]);
      }
      return false;
    }));
  }
}
