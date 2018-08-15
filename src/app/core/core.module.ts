import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { SharedModule } from '../shared/shared.module';

import { UserAvatarComponent } from './avatar/user-avatar.component';
import {NavPageTabsComponent} from './nav-page-tabs/nav-page-tabs.component';
import {NavPageTabsService} from './nav-page-tabs/nav-page-tabs.service';

@NgModule( {
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    UserAvatarComponent,
    NavPageTabsComponent
  ],
  exports: [
    UserAvatarComponent,
    NavPageTabsComponent
  ],
  providers: [
    ConfirmationService,
    NavPageTabsService,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
} )
export class CoreModule {

}
