import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {AnchorIconComponent} from './anchor-icon/anchor-icon.component';

import {CardModule} from './card/card.module';
import {LoaderModule} from './loading/loading.module';
import {FormsModule} from '@angular/forms';

@NgModule( {
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    LoaderModule,
  ],
  exports: [
    CardModule,
    LoaderModule,
    AnchorIconComponent,
  ],
  declarations: [
    AnchorIconComponent,
  ],
  entryComponents: [],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
} )

export class UIModule {
}
