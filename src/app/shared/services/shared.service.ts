
import {distinctUntilChanged, tap} from 'rxjs/operators';
import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, ReplaySubject, Observable} from 'rxjs';
import {Channel} from '../models/channel.model';
import {Well} from '../models/well.model';
import {ChannelAction, ChannelOptions} from '../models/channel-action';
import {LocalCacheService} from './local-cache.service';

@Injectable()
export class SharedService {
  private _channelsList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private _currentBasinWells: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private _wellsObservable;
  private _currentWellStagesList: any[];
  private _currentWell: any;
  private _currentStage: any;
  private _currentAsset: any;
  private _availableStageChannels: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private _channelsObj;
  private _assetChanged: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(private localCache: LocalCacheService) {
    const asset = this.localCache.getItem('asset');
    const well = this.localCache.getItem('well');
    if (asset) {
      this.currentAsset = asset;
    }
    if (well) {
      this.currentWell = well;
    }
    this._wellsObservable = this._currentBasinWells.asObservable()
      .pipe(tap(
      changes => {
        this.emitSharedItem(this._currentBasinWells,  changes );
      }
    ), distinctUntilChanged());
  }

  get currentWell() {
    return this._currentWell;
  }
  set currentWell(well: any) {
    this.localCache.setItem('well', well);
    this._currentWell = well;
  }

  get currentWellStagesList() {
    return this._currentWellStagesList;
  }
  set currentWellStagesList(stages: any) {
    this._currentWellStagesList = stages;
  }
  get currentStage() {
    return this._currentStage;
  }
  set currentStage(stage: any) {
    this._currentStage = stage;
  }
  get currentAsset() {
    return this._currentAsset;
  }
  set currentAsset(asset: any) {
    this.localCache.setItem('asset', asset);
    this._currentAsset = asset;
    this._assetChanged.next(asset);
  }
  get currentAssetChange(): Observable<void> {
    return this._assetChanged.asObservable();
  }
  // Full list of all channels
  get defaultChannelsList() {
    return this._channelsList;
  }
  set defaultChannelsList(list: any) {
    this._channelsList.next(list);
  }
  // Available channels that are getting data but not plotted
  get availableStageChannels() {
    return this._availableStageChannels;
  }
  set availableStageChannels(plotted) {
    this._availableStageChannels.next( plotted );
  }
  // Used to hold converted channels array to an object based on channel names
  get channelsObj() {
    return this._channelsObj;
  }
  set channelsObj(obj) {
    this._channelsObj = obj;
  }

  public emitSharedItem(sharedItem,  value ) {
    sharedItem.next( value );
  }
}
