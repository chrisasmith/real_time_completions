import {catchError, map, share, takeUntil} from 'rxjs/operators';

import {Observable, of as observableOf, throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';

import 'rxjs/util/isNumeric';
import {ApiConstants} from './api-constants.service';
import {AuthHttpClient} from '@apc-ng/core/lib';
import {StompRService} from '@stomp/ng2-stompjs';
import {ActiveWell} from '../models/well.model';

@Injectable()
export class WellsService {
  public activeWells: Observable<ActiveWell[]>;
  private storeData: { wells, copy };

  static handleError( error: any ) {
    console.log( error );
    return observableThrowError(error.message);
  }

  constructor(private http: AuthHttpClient, private stompService: StompRService) {
    this.storeData = {
      wells: [],
      copy: []
    };
    this.activeWells = this.stompService
      .subscribe('/topic/active-wells')
      .pipe(
        map(d => JSON.parse(d.body)),
        share()
      );
  }


  public getWells(asset: string): Observable<any> {
    if (this.storeData[asset] && this.storeData[asset].length) {
      return observableOf({ wells: this.storeData[asset] });
    } else {
    return this.http.get(`${ApiConstants.WELLS_API}/${asset}`).pipe(
      map((response: Response) => {
        this.storeData[asset] = response;
        return { wells: response };
      }),
      catchError( WellsService.handleError ));
    }
  }
}
