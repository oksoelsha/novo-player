import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { DeactivateComponent } from '../../guards/deactivate-guard.service';
import { Settings } from 'src/app/models/settings';
import { AlertsService } from '../../shared/alerts/alerts.service';
import { GamesService } from 'src/app/services/games.service';
import { LocalizationService } from 'src/app/internationalization/localization.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit, AfterViewInit, DeactivateComponent {
  @ViewChild('settingsForm', { static: true }) settingsForm: NgForm;

  openmsxPath = '';
  screenshotsPath = '';
  gameMusicPath = '';
  defaultListing = '';
  webmsxPath = '';
  submitDisabled = true;
  listings: string[] = [];
  language = '';
  languages: string[] = [];
  languageReverseMap: Map<string,string>;

  constructor(private settingsService: SettingsService, private alertService: AlertsService, private gamesService: GamesService,
    private localizationService: LocalizationService) { }

  ngOnInit() {
    this.gamesService.getListings().then((data: string[]) => this.listings = data);
    this.setLanguages();
    const self = this;
    this.settingsService.getSettings().then((settings: Settings) => {
      self.openmsxPath = settings.openmsxPath;
      self.screenshotsPath = settings.screenshotsPath;
      self.gameMusicPath = settings.gameMusicPath;
      self.defaultListing = settings.defaultListing;
      self.webmsxPath = settings.webmsxPath;
      self.setSelectedLanguage(settings);
    });
  }

  ngAfterViewInit() {
    this.settingsForm.statusChanges.subscribe(() => {
      this.submitDisabled = !this.settingsForm.dirty;
    });
  }

  canExit(): boolean {
    return this.submitDisabled;
  }

  updateControl(control: string, value: any) {
    if (this.settingsForm.controls[control].value !== value) {
      this.settingsForm.controls[control].setValue(value);
      this.submitDisabled = false;
    }
  }

  updateField(field: string, value: any) {
    if (value !== this[field]) {
      this[field] = value;
      this.submitDisabled = false;
    }
  }

  submitSettings(form: any) {
    const settings = new Settings(form.value['openmsx-path'], form.value['screenshots-path'], form.value['game-music-path'],
      this.defaultListing, form.value['webmsx-path'], this.languageReverseMap.get(this.language));
    this.settingsService.saveSettings(settings);
    this.localizationService.useLanguage(this.languageReverseMap.get(this.language));
    this.submitDisabled = true;
    this.alertService.success('Settings saved successfully');
  }

  private setLanguages() {
    this.languageReverseMap = new Map();
    for(var language of LocalizationService.Languages) {
      var translatedLanguageCode = this.getLanguageDisplayName(language);
      this.languageReverseMap.set(translatedLanguageCode, language);
      this.languages.push(translatedLanguageCode);
    }
  }

  private getLanguageDisplayName(language: string) {
    return this.localizationService.translate('language.' + language);
  }

  private setSelectedLanguage(settings: Settings) {
    if(settings.language != null) {
      this.language = this.getLanguageDisplayName(settings.language);
    } else {
      this.language = this.getLanguageDisplayName('en-US'); //TODO add system default
    }
  }
}
