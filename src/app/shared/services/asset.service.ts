
import {share, tap} from 'rxjs/operators';

import {of as observableOf, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {ApiConstants} from './api-constants.service';
import {Asset} from '../models/asset.model';
import {AuthHttpClient} from '@apc-ng/core/lib';

@Injectable()
export class AssetService {
    public assets: Asset[] = [];
    constructor(private http: AuthHttpClient) {}
    getAssets(): Observable<Asset[]> {
        if (this.assets.length) {
            return observableOf(this.assets);
        } else {
            return this.http.get(ApiConstants.ASSET_API)
              .pipe(
                tap(assets => {
                  this.assets = assets;
                })
              ).pipe(share());
        }
    }
}
