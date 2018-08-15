import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { ChannelCardComponent } from './channel-card.component';
import {SharedModule} from '../../shared/shared.module';
import {LoadingIndicatorService} from '../../shared/services/loading-indicator.service';
import {ChannelsService} from '../../shared/services/channels.service';
import {Channel, GraphCoordinates} from '../../shared/models/channel.model';

describe('ChannelCardComponent', () => {
  let component: ChannelCardComponent;
  let fixture: ComponentFixture<ChannelCardComponent>;

  beforeEach(async(() => {
    // workaround for https://stackoverflow.com/questions/42260821/using-ngbmodule-forroot-in-component-causing-tests-to-fail
    // this seems to be a bug with the tooltip
    TestBed.configureTestingModule({
      imports: [ SharedModule ],
      declarations: [ ChannelCardComponent ],
      providers: [
        LoadingIndicatorService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCardComponent);
    component = fixture.componentInstance;
    component.info = ({
      default_color: '#FFFFFF',
      channel_name: 'Test',
      plot_min: 1,
      plot_max: 4,
      proper_name: 'TESTSSSS',
      show_in_channel_list: true,
      value: 0,
      decimal_precision: 5,
    } as any);

    const graphCoordinates: GraphCoordinates = {
      visible: true,
      x: [],
      y: []
    };

    const info: Channel = {
        points: graphCoordinates,
        threshold: graphCoordinates,
        pump_schedule: graphCoordinates,
        show_max_pressure: false
      };

    component.info = info;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
