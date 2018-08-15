
import {map, catchError, tap} from 'rxjs/operators';

import {of as observableOf, throwError as observableThrowError, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {ApiConstants} from './api-constants.service';
import {AuthHttpClient} from '@apc-ng/core/lib';
import {Stage} from '../models/stage.model';

interface StageCache {
  [key: string]: Stage[];
}

@Injectable()
export class StagesService {

  private stageCache: StageCache = {};
  static handleError( error: any ) {
    return observableThrowError(error);
  }
  constructor(private http: AuthHttpClient) { }

  public getWellStages(api_no: string): Observable<any> {
    if (this.stageCache[api_no]) {
      return observableOf(this.stageCache[api_no]);
    } else {
      return this.http.get(`${ApiConstants.STAGES_API}/${api_no}`)
        .pipe(tap((response: Stage[]) => {
          this.stageCache[api_no] = response;
          return response;
        })).pipe(
        catchError(StagesService.handleError));
    }
  }
  public getStageData(api_no: string, stageNumber: number): Observable<any> {
      return this.http.get(`${ApiConstants.STAGE_PLOT_API}/${api_no}`).pipe(
        map((response: any) => {
          return { wells: response };
        }),
        catchError(StagesService.handleError));
  }
}
