import {filter, map, take} from 'rxjs/operators';
import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Asset} from './shared/models/asset.model';

import {Subject} from 'rxjs';
import {ToasterConfig} from 'angular2-toaster';
import {UserPreferencesService} from './shared/services/user-preferences.service';
import {AssetService} from './shared/services/asset.service';
import {RouterUtilsService} from './shared/services/router-utils.service';
import {WindowService} from './shared/services/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  toastConfig: ToasterConfig = new ToasterConfig({
    showCloseButton: false,
    tapToDismiss: true,
    timeout: 5000,
    positionClass: 'toast-bottom-right'
  });
  private unsub: Subject<void> = new Subject<void>();
  public theme = 'dark-theme';
  public sidebarCollapse = false;
  public rtcAssets: any;
  public currentAsset: any;
  public isHome: boolean;

  constructor(private userPreferencesService: UserPreferencesService,
              private assetService: AssetService,
              protected route: ActivatedRoute,
              protected router: Router,
              private routerUtils: RouterUtilsService) {
    this.routerUtils.getParamStream().pipe(
      map(params => params.asset),
      filter(asset => asset))
      .subscribe(asset => {
        this.currentAsset = { assetName: asset };
      });
  }

  ngOnInit(): void {
    this.userPreferencesService.theme$.subscribe(t => this.theme = t);
    this.assetService.getAssets().pipe(take(1)).subscribe(assets => {
      this.rtcAssets = assets;
    });
    this.router.events.pipe(filter( event => event instanceof NavigationEnd )).subscribe(( data ) => {
      this.isHome = data['urlAfterRedirects'] === '/';
    });
  }

  ngAfterViewChecked(): void {
    // uncomment this to check for excessive change detection
    // console.log('change detection happened');
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

  public selectedTheme(theme: any): void {
    this.userPreferencesService.setTheme(theme);
    this.theme = theme;
  }

  public toggleSidebar(): void {
    this.sidebarCollapse = !this.sidebarCollapse;
    this.resize();
  }

  goToDash(asset: Asset): void {
    this.router.navigate([ asset.assetName, 'dashboard' ]);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.assetName === c2.assetName : c1 === c2;
  }

  public resize(): void {
    setTimeout( () => {
      WindowService.fireResizeEventOnWindow();
    }, 500);
  }

}
