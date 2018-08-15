import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {StagesService} from '../shared/services/stages.service';

@Injectable()
export class HasStageGuard implements CanActivate {
  constructor(private stagesService: StagesService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const wellApi = route.params.well;
    return this.stagesService.getWellStages(wellApi)
      .pipe(tap(stages => {
      const stage = stages[stages.length - 1];
      const stageNumber = stage ? stage.stage_number : null;
      if (stageNumber !== null) {
        this.router.navigate([ route.params.asset, 'treatment-plot', wellApi, stageNumber ]);
      }
      return false;
    }));
  }
}
