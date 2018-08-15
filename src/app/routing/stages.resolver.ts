import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {StagesService} from '../shared/services/stages.service';

@Injectable()
export class StagesResolver {
  constructor(private stagesService: StagesService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const wellApi = route.params.well;
    return this.stagesService.getWellStages(wellApi);
  }
}
