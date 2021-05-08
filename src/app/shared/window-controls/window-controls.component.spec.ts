import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WindowControlsComponent } from './window-controls.component';

describe('WindowControlsComponent', () => {
  let component: WindowControlsComponent;
  let fixture: ComponentFixture<WindowControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
