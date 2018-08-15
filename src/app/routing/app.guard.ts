
import {mergeMap, concatMap} from 'rxjs/operators';

import {of as observableOf, Observable, zip} from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import * as _ from 'lodash';
import { AppConstantsService } from '../app.constants.service';
import { AuthenticationService, ConfigService } from '@apc-ng/core';
import {flatMap} from 'tslint/lib/utils';

@Injectable()
export class AppGuard implements CanActivate, CanActivateChild {

  private canView: Observable<boolean> | boolean;

  constructor( private appConstantsService: AppConstantsService,
               private router: Router,
               private configService: ConfigService,
               private authenticationService: AuthenticationService) {
    this.appConstantsService.appConstantsObservable.subscribe( appConstants => {
      this.canView = appConstants.canView;
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return zip(
      this.configService.getAppProperties(),
      this.authenticationService.getCredentials()
    ).pipe(mergeMap(( data ) => {
      const cAdGroups = data[1]['groups'].map(g => g.toLowerCase());
      const cAllowedGroups = data[0]['allowedADGroups'].view.map(g => g.toLowerCase());
      const canActivate = cAllowedGroups.some(adGroup => _.includes(cAdGroups, adGroup ));

      if (canActivate) {
        return observableOf(true);
      } else {
        this.router.navigate(['not-authorized']);
        return observableOf(false);
      }

    }));
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean  {
    if (!this.canView) {
      this.router.navigate(['not-authorized']);
      return false;
    }
    return true;
  }

}
