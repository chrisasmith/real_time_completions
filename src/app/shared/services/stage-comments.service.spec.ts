import { TestBed, inject } from '@angular/core/testing';

import { StageCommentsService } from './stage-comments.service';
import {AuthHttpClient} from '@apc-ng/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';

describe('StageCommentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        StageCommentsService,
        {
          provide: AuthHttpClient,
          useClass: HttpClient,
        }
        ]
    });
  });

  it('should be created', inject([StageCommentsService], (service: StageCommentsService) => {
    expect(service).toBeTruthy();
  }));
});
