
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiConstants} from '../shared/services/api-constants.service';
import {DashGraphDataPoint, DashGraphModel} from './shared/dash-graph.model';
import {WellsService} from '../shared/services/wells.service';


import {AssetService} from '../shared/services/asset.service';
import {AuthHttpClient} from '@apc-ng/core/lib';

@Injectable()
export class DashboardDataService {
  dashboardData: DashGraphModel[] = [];
  constructor(
    private http: AuthHttpClient,
    private wellService: WellsService,
    private assetService?: AssetService) { }

  public getWellCount(id: any): Observable<DashGraphDataPoint[]> {
    return this.http.get(`${ApiConstants.DASHBOARD_WELLS_API}/${id}`).pipe(
      map((data: any[]) => {
        return data.map(point => {
          return { x: point.month, y: point.wellCount };
        });
      }));
  }

  public getStageCount(id: any): Observable<DashGraphDataPoint[]> {
    return this.http.get(`${ApiConstants.DASHBOARD_STAGES_API}/${id}`).pipe(
      map((data: any[]) => {
        return data.map(point => {
          return { x: point.month, y: point.stageCount };
        });
      }));
  }

  public getWellLocations(id: any): Observable<any> {
      return this.wellService.getWells(id);
  }
}
