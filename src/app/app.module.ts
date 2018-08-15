import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConfigService, Ng2ApcCoreModule} from '@apc-ng/core';
import {UserService} from '@apc-ng/user';
import {LicenseManager} from 'ag-grid-enterprise/main';
import {ToasterModule} from 'angular2-toaster';
import {AppComponent} from './app.component';
import {AppConstantsService} from './app.constants.service';
import {CoreModule} from './core/core.module';
import {HomeModule} from './home/home.module';
import {AppRoutingModule} from './routing/routing.module';
import {HelperUtilsService} from './shared/services/helper-utils.service';
import {LoadingIndicatorInterceptor, LoadingIndicatorService} from './shared/services/loading-indicator.service';
import {SelectedWellService} from './shared/services/selected-well.service';
import {SharedModule} from './shared/shared.module';
import {SupportComponent} from './support/support.component';
import {TPLOTModule} from './treatment-plot/tplot.module';
import {KerberosAuthenticationModule} from '@apc-ng/accelerator-kerberos/lib';
import {KerberosAuthenticationService} from '@apc-ng/accelerator-kerberos/lib';
import {FeedbackModule} from 'apc-feedback';
import {OverlayContainer} from '@angular/cdk/overlay';
import {UserPreferencesService} from './shared/services/user-preferences.service';
import {takeUntil} from 'rxjs/operators';

LicenseManager
  .setLicenseKey( 'Anadarko_Petroleum_Corporation_MultiApp_10Devs31_October_2018__MTU0MDk0NDAwMDAwMA==450f13523325646d206729f23abe6672' );

export function appConstantsServiceFactory( appConstantsService: AppConstantsService ) {
  return () => {
    appConstantsService.initAppConstants();
  };
}

@NgModule( {
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    Ng2ApcCoreModule,
    CoreModule,
    HomeModule,
    SharedModule,
    TPLOTModule.forRoot(),
    ToasterModule,
    KerberosAuthenticationModule,
    FeedbackModule
  ],
  declarations: [
    AppComponent,
    SupportComponent,
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    LoadingIndicatorService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: ( service: LoadingIndicatorService ) => new LoadingIndicatorInterceptor( service ),
      multi: true,
      deps: [ LoadingIndicatorService ]
    },
    ConfigService,
    UserService,
    AppConstantsService,
    {
      provide: APP_INITIALIZER,
      useFactory: appConstantsServiceFactory,
      deps: [ AppConstantsService ],
      multi: true
    },
    SelectedWellService,
    HelperUtilsService,
  ]
} )
export class AppModule {
  protected currentTheme = 'theme-dark';
  constructor(private kerberosAuthenticationService: KerberosAuthenticationService,
              private userPref: UserPreferencesService,
              private overlayContainer: OverlayContainer) {
    this.kerberosAuthenticationService.init();

    userPref.theme$.asObservable()
      .subscribe(t => {
        overlayContainer.getContainerElement().classList.remove(this.currentTheme);
        overlayContainer.getContainerElement().classList.add(t);
        this.currentTheme = t;
      });
  }
}
