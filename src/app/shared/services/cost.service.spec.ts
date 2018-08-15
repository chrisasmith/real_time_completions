import { TestBed, inject } from '@angular/core/testing';

import { CostService } from './cost.service';

describe('CostService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CostService]
    });
  });

  it('should be created', inject([CostService], (service: CostService) => {
    expect(service).toBeTruthy();
  }));
});
