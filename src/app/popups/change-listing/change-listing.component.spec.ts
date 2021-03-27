import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeListingComponent } from './change-listing.component';

describe('ChangeListingComponent', () => {
  let component: ChangeListingComponent;
  let fixture: ComponentFixture<ChangeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
