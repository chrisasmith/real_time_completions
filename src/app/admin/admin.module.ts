import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {AgGridModule} from 'ag-grid-angular';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';
import { ManagePumpSchedulesComponent } from './manage-pump-schedules/manage-pump-schedules.component';
import {DeleteButtonComponent} from './delete-button/delete-button.component';
import { NumericCellComponent } from './numeric-cell/numeric-cell.component';
import { ManageChannelsComponent } from './manage-channels/manage-channels.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import {ColorPicker} from 'primeng/components/colorpicker/colorpicker';

const routes: Routes = [
  {
    path: ':asset/admin',
    component: AdminComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    AgGridModule.withComponents([DeleteButtonComponent, NumericCellComponent, ColorPickerComponent]),
  ],
  declarations: [
    DeleteButtonComponent,
    AdminComponent,
    ManagePumpSchedulesComponent,
    NumericCellComponent,
    ManageChannelsComponent,
    ColorPickerComponent
  ],
  exports: [
    DeleteButtonComponent,
    AdminComponent,
    AgGridModule,
    ColorPickerComponent
  ],
  providers: [
    ColorPicker
  ],
  entryComponents: [

  ]
})
export class AdminModule {
}
