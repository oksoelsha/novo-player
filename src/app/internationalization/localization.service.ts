import { Injectable, Optional, SkipSelf } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalizationServiceConfig } from './localization-config.service';

@Injectable()
export class LocalizationService {
  public static readonly Languages = [
    'en-US',
    'es-ES',
    'fr-FR'
  ];
  private _localeId: string = 'en-US';

  constructor(
    @Optional() @SkipSelf() private singleton: LocalizationService,
    private config: LocalizationServiceConfig,
    private translateService: TranslateService
  ) {
    if (this.singleton) {
      throw new Error(
        'LocalizationService is already provided by the root module'
      );
    }
    this._localeId = this.config.locale_id;
  }

  initService(): Promise<void> {
    this._localeId = localStorage.getItem('language') || this.config.locale_id;
    return this.useLanguage(this._localeId);
  }

  async useLanguage(lang: string): Promise<void> {
    this.translateService.setDefaultLang(lang);
    return this.translateService
      .use(lang)
      .toPromise()
      .catch(() => {
        throw new Error('LocalizationService.init failed');
      });
  }

  translate(key: string | string[], interpolateParams?: object): string {
    return this.translateService.instant(key, interpolateParams) as string;
  }
}
