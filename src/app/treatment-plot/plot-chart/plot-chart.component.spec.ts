import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { PlotChartComponent } from './plot-chart.component';
import {ChannelsService} from '../../shared/services/channels.service';
import {Channel, GraphCoordinates} from '../../shared/models/channel.model';
import {HttpClientModule} from '@angular/common/http';
import {UserPreferencesService} from '../../shared/services/user-preferences.service';
import {ServicesModule} from '../../shared/services/services.module';
import {ArrayToObjectService} from '../../shared/services/array-to-object.service';
declare let Plotly: any;

describe('PlotChartComponent', () => {
  let component: PlotChartComponent;
  let fixture: ComponentFixture<PlotChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ServicesModule
      ],
      declarations: [ PlotChartComponent ],
      providers: [
        ArrayToObjectService,
        UserPreferencesService,
        ChannelsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotChartComponent);
    component = fixture.componentInstance;

    const graphCoordinates: GraphCoordinates = {
      visible: true,
      x: [],
      y: []
    };

    const plottedChannels: Channel[] = [
      {
        points: graphCoordinates,
        threshold: graphCoordinates,
        pump_schedule: graphCoordinates,
        show_max_pressure: false
      }
    ];

    component._plottedChannels = plottedChannels;

    fixture.detectChanges();
  });

  it('should create ', inject([ChannelsService], (service: ChannelsService) => {
    expect(service).toBeTruthy();
  }));
});
