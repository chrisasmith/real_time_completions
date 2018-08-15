
import {take} from 'rxjs/operators';
import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedService} from './shared.service';
import {HttpClient} from '@angular/common/http';
import {StagesService} from './stages.service';
import {ChannelsService} from './channels.service';
import {WellsService} from './wells.service';
import {StageService} from './stage.service';
import {ArrayToObjectService} from './array-to-object.service';
import {SelectedWellService} from './selected-well.service';
import {AssetService} from './asset.service';
import {StompConfig, StompRService} from '@stomp/ng2-stompjs';
import {environment} from '../../../environments/environment';
import {SelectedStageService} from './selected-stage.service';
import {UserPreferencesService} from './user-preferences.service';
import {LocalCacheService} from './local-cache.service';
import {RouterUtilsService} from './router-utils.service';
import {StageCommentsService} from './stage-comments.service';
import {PumpScheduleService} from './pump-schedule.service';
import {ConfirmationService} from './confirmation.service';
import {CostService} from './cost.service';
import {Ng2ApcCoreModule, AuthenticationService, Credentials} from '@apc-ng/core/lib';

export function configFactory(authService: AuthenticationService, stompR: StompRService) {
  return () => {
    authService.getCredentials().pipe(take(1)).subscribe((credentials: Credentials) => {
      const config: StompConfig = {
        url: environment.streams,
        headers: {
          authorization: credentials.token
        },
        heartbeat_in: 0,
        heartbeat_out: 2000,
        reconnect_delay: 5000,
        debug: false
      };
      stompR.config = config;
      stompR.initAndConnect();
    });
  };
}

@NgModule({
  imports: [
    CommonModule,
    Ng2ApcCoreModule
  ],
  declarations: [],
})
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        StompRService,
        {
          provide: APP_INITIALIZER,
          useFactory: configFactory,
          deps: [ AuthenticationService, StompRService ],
          multi: true
        },
        AssetService,
        HttpClient,
        StagesService,
        StageService,
        SharedService,
        ChannelsService,
        WellsService,
        ArrayToObjectService,
        SelectedWellService,
        SelectedStageService,
        UserPreferencesService,
        LocalCacheService,
        RouterUtilsService,
        StageCommentsService,
        PumpScheduleService,
        ConfirmationService,
        CostService
      ]
    };
  }
}
