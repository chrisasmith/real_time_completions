import { TestBed, inject } from '@angular/core/testing';

import { UserPreferencesService } from './user-preferences.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthHttpClient} from '@apc-ng/core';

describe('UserPreferencesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        UserPreferencesService,
        {
          provide: AuthHttpClient,
          useClass: HttpClient,
        }
      ]
    });
  });

  it('should be created', inject([UserPreferencesService], (service: UserPreferencesService) => {
    expect(service).toBeTruthy();
  }));
});
