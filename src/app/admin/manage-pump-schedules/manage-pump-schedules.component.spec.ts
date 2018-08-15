import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePumpSchedulesComponent } from './manage-pump-schedules.component';
import {MaterialModule} from '../../shared/material-module';
import {AgGridModule} from 'ag-grid-angular';
import {MatSelectModule} from '@angular/material';
import {PumpSchedule} from '../../shared/models/pump-schedule.model';
import {ToasterModule} from 'angular2-toaster';
import {ConfirmationService} from '../../shared/services/confirmation.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PumpScheduleService} from '../../shared/services/pump-schedule.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

describe('ManagePumpSchedulesComponent', () => {
  let component: ManagePumpSchedulesComponent;
  let fixture: ComponentFixture<ManagePumpSchedulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        FormsModule,
        MaterialModule,
        MatSelectModule,
        AgGridModule,
        ToasterModule
      ],
      declarations: [ ManagePumpSchedulesComponent ],
      providers: [
        PumpScheduleService,
        ConfirmationService,
        {
          provide: Router,
          useClass: null,
        },
        {
          provide: ActivatedRoute,
          useValue: null,
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePumpSchedulesComponent);
    component = fixture.componentInstance;

    const  emptyPumpSchedule: PumpSchedule = {
      archived: false,
      asset: '',
      name: '',
      schedule: [null]
    };
    component.selectedPumpSchedule = emptyPumpSchedule;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
