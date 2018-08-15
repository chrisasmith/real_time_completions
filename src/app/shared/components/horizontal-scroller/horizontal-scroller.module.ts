import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import {HorizontalScrollerComponent} from './horizontal-scroller.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HorizontalScrollerComponent,
  ],
  exports: [
    HorizontalScrollerComponent
  ],
  entryComponents: [],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class HorizontalScrollerModule { }
