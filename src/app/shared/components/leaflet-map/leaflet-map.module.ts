import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';


import { LeafletMapComponent } from './leaflet-map.component';
import { LeafletMapService } from './leaflet-map.service';

@NgModule( {
  imports: [
    CommonModule
  ],
  exports: [
    LeafletMapComponent
  ],
  declarations: [
    LeafletMapComponent
  ],
  providers: [
    LeafletMapService
  ],
  entryComponents: [
    LeafletMapComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
} )

export class LeafletMapModule {
}
