import {Injectable} from '@angular/core';
import {AuthHttpClient} from '@apc-ng/core/lib';
import {ApiConstants} from './api-constants.service';
import {StageCasing} from '../models/stage-casing.model';
import {Observable} from 'rxjs';
import {Stage} from '../models/stage.model';
import {StompRService} from '@stomp/ng2-stompjs';
import {map} from 'rxjs/operators';
import {StageData} from '../models/stage-data.model';

@Injectable()
export class StageService {
  private url: string = ApiConstants.STAGE_PLOT_API;
  constructor(private http: AuthHttpClient, private stompService: StompRService) { }

  public getStageData(api: String, stage: number) {
    const apiUrl = `${this.url}/${api}/${stage}`;
    return this.http.get(apiUrl);
  }

  public getStagePlotData(api: String, stage: number): Observable<StageData[]> {
    const apiUrl = `${this.url}/${api}/${stage}`;
    return this.stompService.subscribe(`/user/topic/plot-data/${api}/${stage}`).pipe(
      map(data => JSON.parse(data.body)));
  }

  public updateStageData(api: string, stageNo: number, stage: Stage) {
    return this.http.put(`${this.url}/${api}/${stageNo}`, stage);
  }

  public getCasingData(api: String): Observable<StageCasing[]> {
    const casing = `${this.url}/casing/${api}`;
    return this.http.get(casing);
  }

  public getTargetData(asset: String): Observable<String[]> {
    const targets = `${this.url}/targets/${asset}`;
    return this.http.get(targets);
  }
}
