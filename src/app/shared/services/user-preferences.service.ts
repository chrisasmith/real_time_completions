
import {catchError, map, switchMap, take} from 'rxjs/operators';

import {of as observableOf, Observable, BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthHttpClient} from '@apc-ng/core/lib';
import {UserPreferences} from '../models/user-preferences.model';
import {ApiConstants} from './api-constants.service';
import {ChannelPreferences} from '../models/channel-preferences.model';

@Injectable()
export class UserPreferencesService {
  public preferences: UserPreferences;
  public theme$ = new BehaviorSubject<any>('dark-theme');
  private theme = 'dark-theme';

  constructor(private http: AuthHttpClient) {

  }

  static handleError() {
    console.error('Error retrieving user preferences');
    return observableOf({ channelPreferences: {} });
  }

  public getPreferences(): Observable<UserPreferences> {
    if (this.preferences) { return observableOf(this.preferences); }
    return this.http.get(ApiConstants.PREFERENCES_API).pipe(
      map(prefs => prefs ? prefs : ({ channelPreferences: {} } as UserPreferences)),
      catchError(UserPreferencesService.handleError));
  }

  public setPreferences(prefs: UserPreferences): Observable<UserPreferences> {
    this.preferences = prefs;
    return this.http.post(ApiConstants.PREFERENCES_API, prefs);
  }

  public getChannelPreferences(channel: string): Observable<ChannelPreferences> {
    return this.getPreferences().pipe(map(preferences => {
      const prefs = preferences.channelPreferences[channel];
      return prefs ? prefs : ({ channel_name: channel } as ChannelPreferences);
    }));
  }

  public setChannelPreferences(chanPrefs: ChannelPreferences): Observable<ChannelPreferences> {
    return this.getPreferences().pipe(switchMap(prefs => {
      prefs.channelPreferences[chanPrefs.channel_name] = chanPrefs;
      return this.setPreferences(prefs).pipe(
        map((channelPrefs) => channelPrefs.channelPreferences[chanPrefs.channel_name]));
    }));
  }

  public getChannelPreference(channel: string, key: string): Observable<ChannelPreferences> {
    return this.getChannelPreferences(channel).pipe(map(prefs => {
      return prefs[key];
    }));
  }

  public setChannelPreference(channel: string, key: string, value: boolean | string | number): Observable<ChannelPreferences> {
    return this.getChannelPreferences(channel).pipe(switchMap(prefs => {
      prefs[key] = value;
      return this.setChannelPreferences(prefs);
    }));
  }

  public setTheme(theme: string) {
    this.theme = theme;
    this.theme$.next(theme);
    localStorage.setItem('theme', theme);
  }
}
