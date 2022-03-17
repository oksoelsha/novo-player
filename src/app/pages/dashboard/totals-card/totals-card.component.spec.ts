import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HttpLoaderFactory } from 'src/app/app.module';
import { InternationalizationModule } from 'src/app/internationalization/internationalization.module';
import { Totals } from 'src/app/models/totals';

import { TotalsCardComponent } from './totals-card.component';

describe('TotalsCardComponent', () => {
  let component: TotalsCardComponent;
  let fixture: ComponentFixture<TotalsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InternationalizationModule.forRoot({ locale_id: 'en-US' }),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ TotalsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalsCardComponent);
    component = fixture.componentInstance;
    component.totalsEvent = new Observable<Totals>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
