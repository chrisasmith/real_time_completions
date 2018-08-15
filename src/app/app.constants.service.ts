import { Injectable } from '@angular/core';
import { ConfigService, AuthHttpClient } from '@apc-ng/core';
import { User, UserService } from '@apc-ng/user';
import {Observable, ReplaySubject, BehaviorSubject, zip} from 'rxjs';

import { environment } from '../environments/environment';
import {AuthenticationService} from '@apc-ng/core/lib/index';
import * as _ from 'lodash';

export class AppConstants {
  readonly avatarUrl: string = '';
  readonly baseUrl: string = '';
  readonly user: User;
  readonly adGroups: any[] = [];
  readonly allowedAdGroups: any[] = [];
  readonly canView: Observable<boolean> | boolean;
  readonly canWrite: Observable<boolean> | boolean;
  readonly noWritePermissionsMessage: string = '';
}

@Injectable()
export class AppConstantsService {
  private _appConstantsSubscriber: ReplaySubject<AppConstants> = new ReplaySubject<AppConstants>( 1 );
  private _userRole: string;
  private _currentUser: User;


  constructor(private authHttpClient: AuthHttpClient,
              private configService: ConfigService,
              private userService: UserService,
              private authenticationService: AuthenticationService) {
  }

  public get appConstantsObservable(): Observable<AppConstants> {
    return this._appConstantsSubscriber.asObservable();
  }

  public get currentUser(): User {
    return this._currentUser;
  }

  private userSubject: BehaviorSubject<string> = new BehaviorSubject('visitor');
  public userRole$: Observable<string> = this.userSubject.asObservable();
  get userRole(): string {
    return this._userRole;
  }

  public initAppConstants() {
    zip(
      this.configService.getAppProperties(),
      this.userService.getCurrentUser(),
      this.authenticationService.getCredentials()
    ).pipe().subscribe( ( data ) => {
      sessionStorage.setItem('services', JSON.stringify(data[0]['services']));
      const appProperties: any = data[0];
      this._currentUser = data[1];
      console.log('currentUser: ', this._currentUser);
      const credentials: any = data[2];
      this._appConstantsSubscriber.next({
        avatarUrl: appProperties.services.AVATAR,
        baseUrl: appProperties.services.IPSO_ONSHORE,
        user: this._currentUser,
        adGroups: credentials.groups,
        allowedAdGroups: appProperties.allowedADGroups,
        canView: this.verifyAccess(credentials.groups, appProperties.allowedADGroups.view),
        canWrite: this.verifyAccess(credentials.groups, appProperties.allowedADGroups.write),
        noWritePermissionsMessage: appProperties.messages.noWritePermissionsMessage
      });
      this._userRole = this.filterUserRole(credentials.groups);
      this.userSubject.next(this._userRole);
    }, (error) => {
      console.error(error);
    } );

    // Set App Version
    this.configService.setAppVersion(environment['buildInfo']);

    // Set App Name
    this.configService.setAppName('rtc-ui');
  }

  public verifyAccess(adGroups, allowedGroups): Observable<boolean> | boolean {
    const cAdGroups = adGroups.map(g => g.toLowerCase());
    const cAllowedGroups = allowedGroups.map(g => g.toLowerCase());
    return cAllowedGroups.some(adGroup => _.includes(cAdGroups, adGroup));
  }
  private filterUserRole(adGroups: any[]): string {
    const rolls: string[] = ['app.fpo.rtc.admin', 'app.fpo.rtc.editor', 'app.fpo.rtc.visitor'];
    const arrayToObject = (array) =>
      array.reduce((obj, item) => {
        obj[item] = item;
        return obj;
      }, {});
    const groups = arrayToObject(adGroups);
    let roll = '';
    for (const g of rolls) {
      if (groups[g]) {
        roll =  g.substr(g.lastIndexOf('.') + 1);
        break;
      }
    }
    console.log(roll);
    return roll;
    /* */
  }
}
