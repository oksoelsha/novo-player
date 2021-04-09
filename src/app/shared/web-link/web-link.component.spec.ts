import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebLinkComponent } from './web-link.component';

describe('WebLinkComponent', () => {
  let component: WebLinkComponent;
  let fixture: ComponentFixture<WebLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
