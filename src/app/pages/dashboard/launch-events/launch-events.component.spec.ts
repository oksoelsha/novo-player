import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchEventsComponent } from './launch-events.component';

describe('LaunchEventsComponent', () => {
  let component: LaunchEventsComponent;
  let fixture: ComponentFixture<LaunchEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
