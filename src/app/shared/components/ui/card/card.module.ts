import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CardComponent } from './card.component';

@NgModule( {
  imports: [
    CommonModule
  ],
  exports: [
    CardComponent
  ],
  declarations: [
    CardComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
} )

export class CardModule {
}
