import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveModalComponent } from './save-modal.component';
import {MatButtonModule, MatDialogModule, MatTooltipModule} from '@angular/material';

describe('SaveModalComponent', () => {
  let component: SaveModalComponent;
  let fixture: ComponentFixture<SaveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatButtonModule,
        MatTooltipModule
      ],
      declarations: [ SaveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
