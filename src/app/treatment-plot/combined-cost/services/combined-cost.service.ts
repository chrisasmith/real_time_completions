import { Injectable } from '@angular/core';
import {AuthHttpClient} from '@apc-ng/core/lib';
import {ApiConstants} from '../../../shared/services/api-constants.service';
import {CombinedCost, VariableCost} from '../../../shared/models/cost.model';
import {Observable} from 'rxjs';

@Injectable()
export class CombinedCostService {
  private cost_url: string = ApiConstants.COST_RESULTS;
  private _api: string;
  private _stage: number;

  constructor(private http: AuthHttpClient) { }

  public getCostResultsData(api: string, stage: number): Observable<CombinedCost> {
    this._api = api;
    this._stage = stage;
    const apiUrl = `${this.cost_url}/${api}/${stage}`;
    return this.http.get(apiUrl);
  }

  public updateCombinedCost(cc: VariableCost[]): Observable<CombinedCost> {
    const apiUrl = `${this.cost_url}/${this._api}/${this._stage}`;
    return this.http.post(apiUrl, cc);
  }

}
