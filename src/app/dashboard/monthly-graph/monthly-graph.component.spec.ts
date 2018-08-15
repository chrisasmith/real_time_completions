import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyGraphComponent } from './monthly-graph.component';
import {MonthlyGraphService} from './monthly-graph.service';

describe('MonthlyGraphComponent', () => {
  let component: MonthlyGraphComponent;
  let fixture: ComponentFixture<MonthlyGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    spyOn(MonthlyGraphService.prototype, 'createGraph');
    spyOn(MonthlyGraphService.prototype, 'purge');
    fixture = TestBed.createComponent(MonthlyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redraw the graph when inputs change', () => {
    component.data = [];
    component.ngOnChanges();
    expect(MonthlyGraphService.prototype.createGraph).toHaveBeenCalledTimes(1);
    component.ngOnChanges();
    expect(MonthlyGraphService.prototype.createGraph).toHaveBeenCalledTimes(2);
    component.ngOnChanges();
    expect(MonthlyGraphService.prototype.createGraph).toHaveBeenCalledTimes(3);
  });

  it('should destroy the graph on component destroy', () => {
    component.ngOnDestroy();
    expect(MonthlyGraphService.prototype.purge).toHaveBeenCalledTimes(1);
  });
});
