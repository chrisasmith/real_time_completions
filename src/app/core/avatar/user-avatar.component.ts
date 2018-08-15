import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

import {User} from '@apc-ng/user';
import {AppConstantsService} from '../../app.constants.service';
import {AuthHttpClient} from '@apc-ng/core/lib';

@Component({
  selector: 'app-user-avatar',
  template: `
      <img *ngIf="imgLoaded" alt="{{userName}}" class="avatar smooth-image-rendering"
      [src]="avatarDataImg" height="40" width="40">
      <span class="name">{{userName}}</span>
  `,
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {
  public avatarDataImg: SafeUrl;
  public userName: string;
  public imgLoaded = false;
  constructor(
    private authHttpClient: AuthHttpClient,
    private appConstantsService: AppConstantsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.appConstantsService.appConstantsObservable.subscribe(( appConstants ) => {
      this.getEmployeeAvatar(appConstants.avatarUrl, appConstants.user);
    });
  }

  private getEmployeeAvatar(url: string, user: User): void {
    this.getEmployeeAvatarData(url, user.userId, 640, 480).toPromise()
      .then( (base64Img) => {
          this.avatarDataImg = this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${base64Img}` );
          this.imgLoaded = true;
          this.userName = `${user.firstName} ${user.lastName}`;
        }, (error) => {
          console.error( error );
          this.avatarDataImg = '/assets/no-image-icon-md.png';
          this.userName = `${user.firstName} ${user.lastName}`;
        }
      );
  }

  public getEmployeeAvatarData( url: string, userId: number, maxWidth: number, maxHeight: number ) {
    return this.authHttpClient.get(`${url}/listing/${userId}/imageEncoded?maxWidth=${maxWidth}&maxHeight=${maxHeight}`, { responseType: 'text' });
  }
}
