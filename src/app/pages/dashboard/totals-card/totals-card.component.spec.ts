import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalsCardComponent } from './totals-card.component';

describe('TotalsCardComponent', () => {
  let component: TotalsCardComponent;
  let fixture: ComponentFixture<TotalsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
