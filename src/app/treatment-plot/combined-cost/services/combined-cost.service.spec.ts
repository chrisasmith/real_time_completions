import { TestBed, inject } from '@angular/core/testing';

import { CombinedCostService } from './combined-cost.service';
import {AuthHttpClient} from '@apc-ng/core';

describe('CombinedCostService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [

      ],
      providers: [CombinedCostService]
    });
  });

  it('should be created', inject([CombinedCostService], (service: CombinedCostService) => {
    expect(service).toBeTruthy();
  }));
});
