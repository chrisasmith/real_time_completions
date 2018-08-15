import { TestBed, inject } from '@angular/core/testing';

import { PumpScheduleService } from './pump-schedule.service';
import {AuthenticationService, AuthHttpClient, TokenService} from '@apc-ng/core';
import {HttpClientModule} from '@angular/common/http';

describe('PumpScheduleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        AuthHttpClient,
        AuthenticationService,
        TokenService,
        PumpScheduleService
      ]
    });
  });

  it('should be created', inject([PumpScheduleService], (service: PumpScheduleService) => {
    expect(service).toBeTruthy();
  }));
});
