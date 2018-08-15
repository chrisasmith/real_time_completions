import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalComponent} from './modal.component';
import {FormsModule} from '@angular/forms';
import {ColorPickerModule} from 'primeng/primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../shared/material-module';
import {UserPreferencesService} from '../../shared/services/user-preferences.service';
import {AuthenticationService, AuthHttpClient, TokenService} from '@apc-ng/core';
import {HttpClientModule} from '@angular/common/http';
import {ToasterService} from 'angular2-toaster';
import {ModalModule} from './modal.module';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [
        HttpClientModule,
        FormsModule,
        ColorPickerModule,
        BrowserAnimationsModule,
        ModalModule,
        MaterialModule
      ],
      providers: [
        AuthHttpClient,
        AuthenticationService,
        TokenService,
        ToasterService,
        UserPreferencesService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    component.channel = {
      show_max_pressure: false,
      plot_max: 5,
      plot_min: 1
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
