import { Injectable, Optional, SkipSelf } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';

@Injectable()
export class LocalizationService {
  public static readonly Languages = [
    'en-US',
    'nl-NL',
    'fr-FR',
    'it-IT',
    'ja-JP',
    'pt-BR',
    'es-ES'
  ];
  private languageSetSubject = new Subject<any>();

  constructor(
    @Optional() @SkipSelf() private singleton: LocalizationService,
    private translateService: TranslateService
  ) {
    if (this.singleton) {
      throw new Error(
        'LocalizationService is already provided by the root module'
      );
    }
  }

  initService(): Promise<void> {
    // no need to set the initial language when the service is first initialized. The application will set the initial language
    return Promise.resolve();
  }

  async useLanguage(language: string): Promise<void> {
    const sanitizedLanguage = this.santizeLanguageToUse(language);
    this.translateService.setDefaultLang(sanitizedLanguage);
    return this.translateService
      .use(sanitizedLanguage)
      .toPromise()
      .then(() => {
        this.languageSetSubject.next();
      })
      .catch(() => {
        throw new Error('LocalizationService.init failed');
      });
  }

  translate(key: string | string[], interpolateParams?: object): string {
    return this.translateService.instant(key, interpolateParams) as string;
  }

  getLanguageSetEvent(): Observable<void> {
    return this.languageSetSubject.asObservable();
  }

  private santizeLanguageToUse(language: string): string {
    if (LocalizationService.Languages.indexOf(language) > -1) {
      return language;
    } else {
      return 'en-US';
    }
  }
}
