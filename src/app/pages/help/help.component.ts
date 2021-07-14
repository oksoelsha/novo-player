import { Component, OnInit } from '@angular/core';
import { VersionsService } from 'src/app/services/versions.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['../../common-styles.sass', './help.component.sass']
})
export class HelpComponent implements OnInit {

  extraDataVersion: string = "";
  screenshotsVersion: string = "";
  gameMusicVersion: string = "";

  constructor(private versionsService: VersionsService) { }

  ngOnInit(): void {
    this.versionsService.getExtraDataVersion().then((version: string) => {
      this.extraDataVersion = version;
    });

    this.versionsService.getScreenshotsVersion().then((version: string) => {
      if (version) {
        this.screenshotsVersion = version;
      } else {
        this.screenshotsVersion = "Undefined";
      }
    });

    this.versionsService.getGameMusicVersion().then((version: string) => {
      if (version) {
        this.gameMusicVersion = version;
      } else {
        this.gameMusicVersion = "Undefined";
      }
    });
  }
}
