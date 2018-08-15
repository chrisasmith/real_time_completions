
import {of as observableOf, throwError as observableThrowError, Observable, forkJoin} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {BasicChannel, Channel} from '../models/channel.model';
import {AuthHttpClient} from '@apc-ng/core/lib';
import {ApiConstants} from './api-constants.service';
import {UserPreferencesService} from './user-preferences.service';
import {UserPreferences} from '../models/user-preferences.model';
import {ArrayToObjectService} from './array-to-object.service';

import {Validation} from '../models/pump-schedule.model';

@Injectable()
export class ChannelsService {
  public channelObj: any;
  private _channels: Channel[] = [];
  constructor(private http: AuthHttpClient,
              private preferencesService: UserPreferencesService,
              private array2Obj: ArrayToObjectService) {
  }

  static handleError( error: any ) {
    return observableThrowError(error.message);
  }

  public get channels(): Channel[] {
    return this._channels;
  }

  public set channels(channels: Channel[]) {
    this._channels = channels;
  }

  public getChannels() {
    if (this.channels.length) {
      return observableOf(this.channels);
    } else {
      return forkJoin(
        this.preferencesService.getPreferences(),
        this.http.get(ApiConstants.CHANNELS_API)
      ).pipe(map(resp => {
        const prefs = resp[0];
        const chans = resp[1];
        const channels = chans.map((el: Channel) => {
          this.assignColorAndValue(el);
          this.applyPreferences(el, prefs);
          return el;
        });
        this._channels = channels;
        this.channelObj = this.array2Obj.convert('channel_name', channels);
        return channels;
      }), catchError(ChannelsService.handleError) );
    }
  }

  public getRawChannels(): Observable<BasicChannel[]> {
    return this.http.get(ApiConstants.CHANNELS_API);
  }

  public clearChannels() {

  }

  public updateRawChannels(c: BasicChannel[]): Observable<Validation> {
    return this.http.put(ApiConstants.CHANNELS_API, c);
  }

  public clearChannelData(): void {
    Object.keys(this.channelObj).forEach(k => {
      const channel = this.channelObj[k];
      [ 'points', 'threshold', 'pump_schedule' ].forEach(trace => {
        if (trace in channel) {
          channel[trace].x.length = 0;
          channel[trace].y.length = 0;
        }
      });
    });
  }

  private assignColorAndValue(channel: Channel): void {
    // get random color if missing default color
    channel.default_color =  channel.default_color ?
      channel.default_color :
      `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`;
    channel.value = '00.00';
  }

  private applyPreferences(channel: Channel, prefs: UserPreferences): void {
    // clear out null values
    Object.keys(prefs.channelPreferences).forEach(k => {
      const c = prefs.channelPreferences[k];
      Object.keys(c).forEach(pk => {
        if (c[pk] === null) {
          delete c[pk];
        }
      });
    });
    Object.assign(channel, prefs.channelPreferences[channel.channel_name]);
    channel.points = {
      x: [],
      y: [],
      visible: true
    };
    channel.hide_trace = false;
  }
}
