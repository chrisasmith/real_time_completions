import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {SharedService} from '../shared/services/shared.service';

@Injectable()
export class AssetGuard implements CanActivate {
  constructor(private sharedService: SharedService, private router: Router) {}
  canActivate(): boolean {
    const userHasAsset = !!this.sharedService.currentAsset;
    if (!userHasAsset) {
      this.router.navigate([ 'Home' ]);
    }
    return userHasAsset;
  }
}
