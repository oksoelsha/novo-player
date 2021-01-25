import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SettingsService } from '../../services/settings.service'
import { DeactivateComponent } from '../../guards/deactivate-guard.service';
import { Settings } from 'src/app/models/settings';
import { AlertsService } from '../../shared/alerts/alerts.service';
import { GamesService } from 'src/app/services/games.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit, AfterViewInit, DeactivateComponent {
  @ViewChild('settingsForm') settingsForm: NgForm;

  openmsxPath: string = "";
  screenshotsPath: string = "";
  defaultListing: string = "";
  submitDisabled: boolean = true;
  private listings: string[] = [];

  constructor(private settingsService: SettingsService, private alertService: AlertsService, private gamesService: GamesService) { }

  ngOnInit() {
    var self = this;
    this.gamesService.getListings().then((data: string[]) => this.listings = data);
    this.settingsService.getSettings().then((settings: Settings) => {
      self.openmsxPath = settings.openmsxPath;
      self.screenshotsPath = settings.screenshotsPath;
      self.defaultListing = settings.defaultListing;
    })
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
    if(this.settingsForm.controls[control].value != value) {
      this.settingsForm.controls[control].setValue(value);
      this.submitDisabled = false;
    }
  }

  submitSettings(form: any) {
    let settings = new Settings(form.value['openmsx-path'], form.value['screenshots-path'], form.value['default-listing']);
    this.settingsService.saveSettings(settings);
    this.submitDisabled = true;
    this.alertService.success('Settings saved successfully');
  }
}
