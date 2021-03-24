import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchActivityComponent } from './launch-activity.component';

describe('LaunchActivityComponent', () => {
  let component: LaunchActivityComponent;
  let fixture: ComponentFixture<LaunchActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
