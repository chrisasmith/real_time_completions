import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ApcUIComponentModule} from '@apc-ng/ui-components/lib';
// import { SimpleNotificationsModule } from 'angular2-notifications';
import {ColorPickerModule} from 'primeng/colorpicker';
import {
  CalendarModule,
  ConfirmDialogModule,
  ContextMenuModule,
  DialogModule,
  InputSwitchModule,
  SharedModule as PrimNgSharedModule,
  SliderModule,
  TabViewModule,
  ToggleButtonModule,
} from 'primeng/primeng';

import {DataCardComponent} from './components/data-card/data-card.component';
import {HorizontalScrollerModule} from './components/horizontal-scroller/horizontal-scroller.module';
import {LeafletMapModule} from './components/leaflet-map/leaflet-map.module';
import {NavbarRightComponent} from './components/navbar-right/navbar-right.component';
import {UIModule} from './components/ui/ui.module';
import {AutofocusDirective} from './directives/autofocus.directive';
import {MomentPipe} from './pipes/moment.pipe';
import {NumericPipe} from './pipes/numeric.pipe';
import {SanitizeHtmlPipe} from './pipes/sanitize-html.pipe';
import {ScientificNotationPipe} from './pipes/scientific-notation.pipe';
import {ServicesModule} from './services/services.module';
import {ConfirmationModalComponent} from './components/confirmation-modal/confirmation-modal.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SaveModalComponent} from './components/save-modal/save-modal.component';
import {MaterialModule} from './material-module';


@NgModule( {
  imports: [
    CommonModule,
    FormsModule,
    ToggleButtonModule,
    CalendarModule,
    DialogModule,
    InputSwitchModule,
    ConfirmDialogModule,
    SliderModule,
    TabViewModule,
    UIModule,
    ApcUIComponentModule,
    ServicesModule.forRoot(),
    HorizontalScrollerModule,

    PrimNgSharedModule,
    ContextMenuModule,
    ColorPickerModule,

    MaterialModule,

    FlexLayoutModule,
  ],
  exports: [
    CommonModule,
    InputSwitchModule,
    ToggleButtonModule,
    CalendarModule,
    DialogModule,
    ConfirmDialogModule,
    TabViewModule,
    SliderModule,
    PrimNgSharedModule,
    AutofocusDirective,
    UIModule,
    MomentPipe,
    NumericPipe,
    SanitizeHtmlPipe,
    ApcUIComponentModule,
    ScientificNotationPipe,
    ServicesModule,
    HorizontalScrollerModule,
    NavbarRightComponent,
    DataCardComponent,
    LeafletMapModule,
    ColorPickerModule,
    ContextMenuModule,

    MaterialModule,

    FlexLayoutModule,
  ],
  declarations: [
    AutofocusDirective,
    MomentPipe,
    NumericPipe,
    SanitizeHtmlPipe,
    ScientificNotationPipe,
    NavbarRightComponent,
    DataCardComponent,
    ConfirmationModalComponent,
    SaveModalComponent

  ],
  providers: [
  ],
  entryComponents: [
    ConfirmationModalComponent,
    SaveModalComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class SharedModule {
}
