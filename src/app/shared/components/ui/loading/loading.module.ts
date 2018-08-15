import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LoadingComponent } from './loading.component';

@NgModule( {
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent
  ],
  declarations: [
    LoadingComponent
  ],
  providers: [

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
} )

export class LoaderModule {
}
