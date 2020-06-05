import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SettingsService } from '../../services/settings.service'
import { DeactivateComponent } from '../../guards/deactivate-guard.service';
import { Settings } from 'src/app/models/settings';
import { AlertsService } from '../../shared/alerts/alerts.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit, AfterViewInit, DeactivateComponent {
  @ViewChild('settingsForm') settingsForm: NgForm;

  openmsxPath: string = "";
  screenshotsPath: string = "";
  submitDisabled: boolean = true;

  constructor(private settingsService: SettingsService, private alertService: AlertsService) { }

  ngOnInit() {
    var self = this;
    this.settingsService.getSettings().then((settings: Settings) => {
      self.openmsxPath = settings.openmsxPath;
      self.screenshotsPath = settings.screenshotsPath;
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
    let settings = new Settings(form.value['openmsx-path'], form.value['screenshots-path']);
    this.settingsService.saveSettings(settings);
    this.submitDisabled = true;
    this.alertService.success('Settings saved successfully');
  }
}
