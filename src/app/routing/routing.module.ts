import {APP_BASE_HREF} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../home/home.component';
import {SupportComponent} from '../support/support.component';
import {AuthGuard} from './auth.guard';
import {PageNotFoundComponent} from './page-404/page-not-found.component';
import {PageServerErrorComponent} from './page-500/page-server-error.component';
import {RouterLinksComponent} from './routing-links.component';
import {RoutingPreloader} from './routing-preloader';
import {AssetGuard} from './asset.guard';
import {NotAuthorizedComponent} from './not-authorized/not-authorized.component';
import {AppGuard} from './app.guard';
import {SharedModule} from '../shared/shared.module';
import {WellsResolver} from './wells.resolver';
import {StagesResolver} from './stages.resolver';
import {ChannelsResolver} from './channels.resolver';
import {TPLOTModule} from '../treatment-plot/tplot.module';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {DashboardModule} from '../dashboard/dashboard.module';
import {AdminModule} from '../admin/admin.module';
import {BugReporterComponent} from '../bug-reporter/bug-reporter.component';
import {BugReporterModule} from '../bug-reporter/bug-reporter.module';

export function tplotChildren(): any {
  return TPLOTModule;
}

export function adminChildren(): any {
  return AdminModule;
}

export function bugChildren(): any {
  return BugReporterComponent;
}

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      isHome: true
    }
  },
  {
    path: ':asset',
    // canActivateChild: [ AppGuard ],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'treatment-plot',
        canActivateChild: [ AppGuard ],
        loadChildren: tplotChildren,
      },
      {
        path: 'admin',
        canActivate: [ AppGuard ],
        loadChildren: adminChildren,
      },
      {
        path: 'bug',
        canActivate: [ AppGuard ],
        loadChildren: bugChildren,
      },
      {
        path: '**',
        component: PageNotFoundComponent
      },
    ]
  },
  {
    path: 'support',
    component: SupportComponent,
    data: {
    }
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule( {
  imports: [
    RouterModule.forRoot( routes, {
      useHash: true,
      enableTracing: false,
      preloadingStrategy: RoutingPreloader
    }),
    TPLOTModule,
    DashboardModule,
    AdminModule,
    BugReporterModule,
    SharedModule
  ],
  providers: [
    AuthGuard,
    AppGuard,
    AssetGuard,
    { provide: APP_BASE_HREF, useValue: '/' },
    RoutingPreloader,
    WellsResolver,
    StagesResolver,
    ChannelsResolver,
  ],
  declarations: [
    RouterLinksComponent,
    PageNotFoundComponent,
    PageServerErrorComponent,
    NotAuthorizedComponent,
  ],
  exports: [
    RouterModule,
    RouterLinksComponent
  ]
} )
export class AppRoutingModule {
}
