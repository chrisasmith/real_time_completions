import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { ManageChannelsComponent } from './manage-channels.component';
import {MatButtonModule, MatFormFieldModule, MatTooltipModule} from '@angular/material';
import {AgGridModule} from 'ag-grid-angular';
import {ChannelsService} from '../../shared/services/channels.service';
import {SharedModule} from '../../shared/shared.module';
import {ColorPickerComponent} from '../color-picker/color-picker.component';
import {DeleteButtonComponent} from '../delete-button/delete-button.component';
import {NumericCellComponent} from '../numeric-cell/numeric-cell.component';
import {AuthenticationService, AuthHttpClient, TokenService} from '@apc-ng/core';
import {HttpClient, HttpClientModule, HttpEvent} from '@angular/common/http';
import {UserPreferencesService} from '../../shared/services/user-preferences.service';
import {ArrayToObjectService} from '../../shared/services/array-to-object.service';
import {ToasterService} from 'angular2-toaster';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DashboardDataService} from '../../dashboard/dashboard-data.service';
import {ApiConstants} from '../../shared/services/api-constants.service';
import {BasicChannel, Channel, GraphCoordinates} from '../../shared/models/channel.model';


describe('ManageChannelsComponent', () => {
  let component: ManageChannelsComponent;
  let fixture: ComponentFixture<ManageChannelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        AgGridModule.withComponents([DeleteButtonComponent, NumericCellComponent, ColorPickerComponent]),
        MatFormFieldModule,
        MatTooltipModule,
        MatButtonModule
      ],
      declarations: [
        ManageChannelsComponent,
        DeleteButtonComponent,
        NumericCellComponent,
        ColorPickerComponent
      ],
      providers: [
        ToasterService,
        ChannelsService
      ],
      schemas: [

      ]
    })
    .compileComponents();
  }));

  let httpClientSpy: { get: jasmine.Spy };
  let channelsService: ChannelsService;
  const graphCoordinates: GraphCoordinates = {
    visible: true,
    x: [],
    y: []
  };

  const channel: Channel = {
    points: graphCoordinates,
    threshold: graphCoordinates,
    pump_schedule: graphCoordinates,
    show_max_pressure: false
  };
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const prefSrv: UserPreferencesService = new UserPreferencesService(null);
    const array2obj: ArrayToObjectService = new ArrayToObjectService();
    channelsService = new ChannelsService(<any> httpClientSpy, prefSrv as UserPreferencesService, array2obj as ArrayToObjectService);

    fixture = TestBed.createComponent(ManageChannelsComponent);
    component = fixture.componentInstance;

    component._userCanEdit = true;
    component.channelsDef = [];

    fixture.detectChanges();
  });


  xit('should get users', inject(
      [HttpTestingController, ChannelsService], (
        httpMock: HttpTestingController,
        channelService: ChannelsService ) => {

        const mockChannels = [
          channel,
          channel
        ];

        channelService.getRawChannels().subscribe((c: BasicChannel[]) => {
          expect(c).toEqual(mockChannels);
        });

        const mockReq = httpMock.expectOne(ApiConstants.CHANNELS_API);

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.responseType).toEqual('json');

        mockReq.flush(mockChannels);

        httpMock.verify();
      }
    )
  );



  xit('should return channels', () => {
    httpClientSpy.get.and.returnValue([channel]);
    channelsService.getRawChannels().subscribe(
      (c) => {
        return expect(c).toEqual([channel], 'expected channels');
      }, fail );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
