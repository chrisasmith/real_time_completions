import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {NavPageTabsService} from './nav-page-tabs.service';
import {MENU} from '../menu/menu';
import {MenuItem} from '../menu/menu-item';
import * as _ from 'lodash';
import {RouterUtilsService} from '../../shared/services/router-utils.service';
import {MenuService} from '../menu/menu.service';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {FeedbackService} from 'apc-feedback';
import {HttpClient} from '@angular/common/http';
import {AppConstantsService} from '../../app.constants.service';
import {User} from '../../shared/models/user.model';
import {take} from 'rxjs/internal/operators';
import {ApiConstants} from '../../shared/services/api-constants.service';

@Component({
  selector: 'app-nav-page-tabs',
  templateUrl: './nav-page-tabs.component.html',
  styleUrls: ['./nav-page-tabs.component.scss'],
  providers: [ MenuService ]
})
export class NavPageTabsComponent implements OnInit, OnDestroy {

  @Output() sidebarCollapse = new EventEmitter<void>();
  public sidebarCollapsed = false;
  public featureFlags = {
    rtdDashboard: true
  };
  public collapsedIcon = 'keyboard_arrow_left';
  public menuItems: MenuItem[] = MENU;
  private unsubscribe: Subject<void> = new Subject<void>();
  private currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private routerUtils: RouterUtilsService,
    private navTabService: NavPageTabsService,
    private feedbackService: FeedbackService,
    private httpClient: HttpClient,
    private appConstantsService: AppConstantsService
  ) { }

  ngOnInit() {
    // this.featureFlags = this.userPreferences.getFeatureFlags();
    this.routerUtils.getParamStream()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => this.replaceRouterParams(params));

    this.appConstantsService.appConstantsObservable
      .pipe(take(1))
      .subscribe( appConstants => {
        this.currentUser = appConstants.user;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  toggleSidebarCollapse() {
    this.sidebarCollapse.next();
    this.sidebarCollapsed = !this.sidebarCollapsed;
    if (this.sidebarCollapsed) {
      this.collapsedIcon = 'keyboard_arrow_right';
    } else {
      this.collapsedIcon = 'keyboard_arrow_left';
    }
    this.navTabService.sidenavToggled();
  }

  replaceRouterParams(paramMap: any): void {
    this.menuService.getMenuItems().then(items => {
      const len = Object.keys(paramMap).length;

      if (!len) {
        this.menuItems = items;
        return;
      }

      this.menuItems = _.cloneDeep(items).map(item => {
        item.routing = this.routerUtils.resolveRouteString(item.routing, paramMap);
        return item;
      });
    });
  }
  openBugTracker(): void {
    console.log('-- appVersion: ', ApiConstants.APP_VERSION, this.currentUser.userName);
    this.feedbackService.openFeedback({
      serverUrl: 'http://houaaetd003.anadarko.com:8090',
      appName: 'Real-Time Completions',
      displayName: 'RTC',
      versionNumber: ApiConstants.APP_VERSION,
      wikiLink: 'http://sp/corpaffair/apphelp/rtc/Pages/default.aspx',
      httpClient: this.httpClient,
      userName: this.currentUser.userName
    });
  }
}
