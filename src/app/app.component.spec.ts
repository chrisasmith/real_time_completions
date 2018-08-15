import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import {CoreModule} from './core/core.module';
import {RouterTestingModule} from '@angular/router/testing';
import {LoadingIndicatorService} from './shared/services/loading-indicator.service';
import {SharedModule} from './shared/shared.module';
import {HttpHandler} from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        CoreModule,
        RouterTestingModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        LoadingIndicatorService,
        HttpHandler,
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
