import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { LeafletMapComponent } from '../shared/components/leaflet-map/leaflet-map.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardDataService } from './dashboard-data.service';
import { DashboardComponent } from './dashboard.component';
import { MonthlyGraphComponent } from './monthly-graph/monthly-graph.component';
import { Coordinate } from '../shared/components/leaflet-map/coordinate.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    const wellSpy = jasmine.createSpyObj('WellsService',
      {
        'getWells': Observable.of({ wells: [{ surface_latitude: 1.1, surface_longitude: 2.5 }] }),
      }
    );
    spyOn(DashboardDataService.prototype, 'getWellLocations').and.returnValue(Observable.of([]));
    spyOn(DashboardDataService.prototype, 'getWellCount').and.returnValue(Observable.of([]));
    spyOn(DashboardDataService.prototype, 'getStageCount').and.returnValue(Observable.of([]));
    spyOn(Router.prototype, 'navigate');
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        DashboardComponent,
        MonthlyGraphComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data', () => {
    // set current asset to trigger data change
    // component.sharedService.currentAsset = { assetName: 'test' };
    expect(DashboardDataService.prototype.getWellLocations).toHaveBeenCalledTimes(1);
    expect(DashboardDataService.prototype.getWellCount).toHaveBeenCalledTimes(1);
    expect(DashboardDataService.prototype.getStageCount).toHaveBeenCalledTimes(1);
  });

  it('should navigate to treatment plot', () => {
    const mapFixture: DebugElement = fixture.debugElement.query(By.directive(LeafletMapComponent));
    const map: LeafletMapComponent = mapFixture.componentInstance;
    const mockWell: Coordinate = {
      active: false,
      surface_latitude: 5,
      surface_longitude: 5,
      selected: true,
      name: 'test well',
    };
    map.selectedCoordinateChange.emit(mockWell);
    expect(Router.prototype.navigate).toHaveBeenCalledTimes(1);
    expect(Router.prototype.navigate).toHaveBeenCalledWith([ 'TPLOT' ]);
  });
});
