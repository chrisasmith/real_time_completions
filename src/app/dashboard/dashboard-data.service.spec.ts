import {DashboardDataService} from './dashboard-data.service';
import {inject, TestBed} from '@angular/core/testing';
import {HttpTestingController, HttpClientTestingModule} from '@angular/common/http/testing';
import {ApiConstants} from '../shared/services/api-constants.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {WellsService} from '../shared/services/wells.service';
import {SelectedWellService} from '../shared/services/selected-well.service';
import {SharedModule} from '../shared/shared.module';
import {AuthHttpClient, TokenService} from '@apc-ng/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';

describe('DashboardDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule
      ],
      providers: [
        TokenService,
        HttpClientModule,
        {
          provide: AuthHttpClient,
          useClass: HttpClient,
        },
        DashboardDataService,
        WellsService,
        SelectedWellService,
      ]
    });
  });


  beforeEach(() => {
  });

  it('should be created', inject([DashboardDataService], (service: DashboardDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should get well count',
    inject([DashboardDataService, HttpTestingController],
      (service: DashboardDataService, backend: HttpTestingController) => {
        const returnValue = [ { month: '1/1/2018', wellCount: 5 } ];
        service.getWellCount('DELAWARE BASIN').subscribe((data) => {
          expect(data).toEqual([ { x: '1/1/2018', y: 5 } ]);
        });
        backend.expectOne(`${ApiConstants.DASHBOARD_WELLS_API}/DELAWARE BASIN`)
               .flush(returnValue, { status: 200, statusText: 'Ok' });
      }
    )
  );

  it('should get stage count',
    inject([DashboardDataService, HttpTestingController],
      (service: DashboardDataService, backend: HttpTestingController) => {
        const returnValue = [ { month: '1/1/2018', stageCount: 5 } ];
        service.getStageCount('DELAWARE BASIN').subscribe((data) => {
          expect(data).toEqual([ { x: '1/1/2018', y: 5 } ]);
        });
        backend.expectOne(`${ApiConstants.DASHBOARD_STAGES_API}/DELAWARE BASIN`)
               .flush(returnValue, { status: 200, statusText: 'Ok' });
      }
    )
  );

  it('should get well locations',
    inject([DashboardDataService ],
      (service: DashboardDataService, wellService: WellsService) => {
        const wells = [
          {
            _id: 'RAYMORE 1-48 UNIT 2H',
            api_no_10: '4230133702',
            name: 'RAYMORE 1-48 UNIT 2H',
            active: false,
            wins_no: 'K1241',
            cmpl_no: '01',
            asset_name: 'DELAWARE BASIN',
            formation: 'WOLFCAMP SHALE',
            afe_no: '2138337',
            surface_latitude: 31.6915703,
            surface_longitude: -103.482103,
            county: 'LOVING',
            state: 'TEXAS',
            pad_name: 'RAYMORE 1-48 UNIT 2H PAD',
            start_date: '1/12/2018 7:00:00 AM',
            end_date: '1/22/2018 4:15:00 PM'
          },
        ];
        const returnValue = Observable.of( [ ...wells ] );
        spyOn(WellsService.prototype, 'getWells').and.returnValue(returnValue);
        service.getWellLocations('DELAWARE BASIN').subscribe((data) => {
          expect(data).toEqual(wells);
        });
      }
    )
  );
});
