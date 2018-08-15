import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../shared/shared.module';
import {MonthlyGraphComponent} from '../dashboard/monthly-graph/monthly-graph.component';
import {DashboardDataService} from '../dashboard/dashboard-data.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        SharedModule,
      ],
      declarations: [
        HomeComponent,
        MonthlyGraphComponent,
      ],
      providers: [
        DashboardDataService,
        HttpClient,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
