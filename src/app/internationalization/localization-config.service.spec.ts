import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { InternationalizationModule } from './internationalization.module';

import { LocalizationServiceConfig } from './localization-config.service';

describe('LocalizationConfigService', () => {
  let service: LocalizationServiceConfig;

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
      ]
    })
    .compileComponents();
    service = TestBed.inject(LocalizationServiceConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
