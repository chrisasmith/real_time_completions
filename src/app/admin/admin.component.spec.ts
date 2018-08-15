import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import {MatTabsModule} from '@angular/material';
import {ManageChannelsComponent} from './manage-channels/manage-channels.component';
import {ManagePumpSchedulesComponent} from './manage-pump-schedules/manage-pump-schedules.component';
import {MaterialModule} from '../shared/material-module';
import {AgGridModule} from 'ag-grid-angular';
import {FormsModule} from '@angular/forms';
import {UserPreferencesService} from '../shared/services/user-preferences.service';
import {AppConstantsService} from '../app.constants.service';
import {AuthenticationService, AuthHttpClient, ConfigService, TokenService} from '@apc-ng/core/lib';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../shared/shared.module';
import {UserService} from '@apc-ng/user';
import {ColorPickerComponent} from './color-picker/color-picker.component';
import {DeleteButtonComponent} from './delete-button/delete-button.component';
import {NumericCellComponent} from './numeric-cell/numeric-cell.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientModule,
        FormsModule,
        AgGridModule.withComponents([DeleteButtonComponent, NumericCellComponent, ColorPickerComponent]),
        MaterialModule
      ],
      declarations: [
        AdminComponent,
        ManageChannelsComponent,
        ManagePumpSchedulesComponent
      ],
      providers: [
        UserService,
        ConfigService,
        TokenService,
        AuthenticationService,
        AuthHttpClient,
        UserPreferencesService,
        AppConstantsService
      ],
      schemas: [

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
