import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ColorPickerModule} from 'primeng/colorpicker';

import { ChannelCardComponent } from './channel-card.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    SharedModule,
  ],
  declarations: [
    ChannelCardComponent
  ],
  exports: [
    ChannelCardComponent
  ]
})
export class ChannelCardModule { }
