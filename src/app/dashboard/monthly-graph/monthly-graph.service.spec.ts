import { TestBed, inject } from '@angular/core/testing';
import {Chart} from 'chart.js';
import { MonthlyGraphService } from './monthly-graph.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthHttpClient} from '@apc-ng/core';

describe('MonthlyGraphService', () => {
  const testData = [
    { x: '1/1/2018', y: 4 },
    { x: '2/1/2018', y: 5 },
    { x: '3/1/2018', y: 6 },
    { x: '4/1/2018', y: 7 },
    { x: '5/1/2018', y: 8 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        MonthlyGraphService,
        {
          provide: AuthHttpClient,
          useClass: HttpClient,
        }
        ]
    });
  });

  it('should be created', inject([MonthlyGraphService], (service: MonthlyGraphService) => {
    expect(service).toBeTruthy();
  }));

  it('should create month labels for graph', inject([MonthlyGraphService], (service: MonthlyGraphService) => {
    expect((service as any).createLabels([
      { x: 1, y: 4 },
      { x: 2, y: 5 },
      { x: 3, y: 6 },
      { x: 4, y: 7 },
      { x: 5, y: 8 },
    ])).toEqual([ 'January', 'February', 'March', 'April', 'May' ]);
  }));

  it('should create a graph', inject([MonthlyGraphService], (service: MonthlyGraphService) => {
    const mockCanvas = { getContext: (type: string) => [] };
    spyOn(Chart.prototype, 'constructor');
    service.createGraph(mockCanvas as any, '#ff0000', '#fff', testData, 'metric', 'metric');
    expect(service.chart instanceof Chart).toEqual(true);
  }));

  it('should destroy the chart', inject([MonthlyGraphService], (service: MonthlyGraphService) => {
    service.chart = jasmine.createSpyObj('chart', [ 'destroy' ]);
    service.purge();
    expect(service.chart.destroy).toHaveBeenCalledTimes(1);
  }));
});
