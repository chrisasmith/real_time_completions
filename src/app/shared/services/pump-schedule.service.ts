
import {of as observableOf, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthHttpClient} from '@apc-ng/core/lib';
import {ApiConstants} from './api-constants.service';
import {PumpSchedule, Validation} from '../models/pump-schedule.model';
import {tap} from 'rxjs/operators';
import {catchError} from 'rxjs/internal/operators';

@Injectable()
export class PumpScheduleService {

  url = ApiConstants.PUMPSCHEDULE_API;

  constructor(private http: AuthHttpClient) { }

  public getPumpSchedules(asset: string): Observable<PumpSchedule[]> {
    const apiUrl = `${this.url}/${asset}`;
    return this.http.get(apiUrl).pipe(tap(data => {
      data.forEach(schedule => {
        schedule.schedule
          .sort((obj1, obj2) => {
            return obj1.step_num - obj2.step_num;
          })
          .forEach(s => {
          s.step_num = parseInt(s.step_num, 10);
          s.pump_rate = parseInt(s.pump_rate, 10);
          s.step_volume_gal = parseInt(s.step_volume_gal, 10);
          s.proppant_conc = s.proppant_conc ? parseFloat(s.proppant_conc) : void(0);
        });
      });
    }));
  }

  public updatePumpSchedule(ps: PumpSchedule): Observable<Validation|null> {
    const asset = ps.asset;
    const id = ps.id;
    const apiUrl = `${this.url}/${asset}/${id}`;
    let obs: Observable< Validation |null>;
    if (asset && id) {
      obs = this.http.put(apiUrl, ps);
    } else {
      obs = observableOf(null);
    }
    return obs;
  }

  public addPumpSchedule(ps: PumpSchedule): Observable<Validation> {
    const apiUrl = `${this.url}/${ps.asset}`;
    return this.http.post(apiUrl, ps);
  }

  public deletePumpSchedule(asset: string, id: string) {
    const apiUrl = `${this.url}/${asset}/${id}`;
    return this.http.delete(apiUrl);
  }

  public getPumpSchedulePlotData(well: string, stage: number, psId: string): Observable<any> {
    return this.http.get(`${this.url}/plot/${well}/${stage}/${psId}`).pipe(
      catchError(val => observableOf(null))
    );
  }
}
