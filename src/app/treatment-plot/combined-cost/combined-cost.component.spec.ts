import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CombinedCostComponent} from './combined-cost.component';
import {CostTableComponent} from './cost-table/cost-table.component';
import {AgGridModule} from 'ag-grid-angular';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthHttpClient, CommonConfigService, ConfigService} from '@apc-ng/core';
import {MaterialModule} from '../../shared/material-module';
import {CostService} from '../../shared/services/cost.service';
import {UserPreferencesService} from '../../shared/services/user-preferences.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {RouterUtilsService} from '../../shared/services/router-utils.service';
import {ToasterService} from 'angular2-toaster';
import {AppConstantsService} from '../../app.constants.service';
import {UserService} from '@apc-ng/user';
import {ServicesModule} from '../../shared/services/services.module';
import {NumericCellComponent} from '../../admin/numeric-cell/numeric-cell.component';
import {CombinedCostService} from './services/combined-cost.service';
import {of} from 'rxjs/internal/observable/of';

fdescribe('CombinedCostComponent', () => {
  let component: CombinedCostComponent;
  let fixture: ComponentFixture<CombinedCostComponent>;

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const activateRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['navigateByUrl']);

    const costSvcSpy = jasmine.createSpyObj('CombinedCostService', ['getCostResultsData']);
    costSvcSpy.getCostResultsData.and.returnValue(of({
      fixed_costs: [],
      variable_costs: [],
    }));

    const routeUtilsSpy = jasmine.createSpyObj('RouterUtilsService', ['getFullTreeParams']);
    routeUtilsSpy.getFullTreeParams.and.returnValue({
      asset: 'DELAWARE BASIN',
      well: '4230133700',
      stage: '1',
    });

    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        MaterialModule,
        AgGridModule,
        ServicesModule,
        AgGridModule.withComponents([NumericCellComponent]),
      ],
      declarations: [
        CombinedCostComponent,
        CostTableComponent,
        NumericCellComponent
      ],
      providers: [
        UserPreferencesService,
        {
          provide: CombinedCostService,
          useValue: costSvcSpy,
        },
        {
          provide: RouterUtilsService,
          useValue: routeUtilsSpy
        },
        ToasterService,
        AppConstantsService,
        ConfigService,
        CommonConfigService,
        UserService,
        {
          provide: AuthHttpClient,
          useClass: HttpClient,
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activateRouteSpy }

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinedCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
