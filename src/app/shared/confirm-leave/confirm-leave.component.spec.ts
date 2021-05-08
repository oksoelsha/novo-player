import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmLeaveComponent } from './confirm-leave.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

describe('ConfirmLeaveComponent', () => {
  let component: ConfirmLeaveComponent;
  let fixture: ComponentFixture<ConfirmLeaveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmLeaveComponent ],
      providers: [ BsModalRef ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
