import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalComponent} from './modal.component';
import {MaterialModule} from '../../shared/material-module';
import {ColorPickerModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ColorPickerModule,
    MaterialModule,
    MatDialogModule,
    FlexLayoutModule,

  ],
  declarations: [
    ModalComponent
  ],
  exports: [
    ModalComponent
  ],
  entryComponents: [
    ModalComponent
  ]
})
export class ModalModule { }
