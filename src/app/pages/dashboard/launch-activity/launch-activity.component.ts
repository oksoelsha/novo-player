import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models/game';
import { LaunchActivity, LaunchActivityService } from 'src/app/services/launch-activity.service';

@Component({
  selector: 'app-dashboard-launch-activity-card',
  templateUrl: './launch-activity.component.html',
  styleUrls: ['../../../common-styles.sass', '../dashboard.component.sass', './launch-activity.component.sass']
})
export class LaunchActivityComponent implements OnInit, OnDestroy {

  private launchActivitySubscription: Subscription;
  launchActivities: LaunchActivity[] = [];
  fileGroupMap: Map<number,string[]> = new Map();

  constructor(private launchActivityService: LaunchActivityService) {
    const self = this;
    this.launchActivitySubscription = this.launchActivityService.getUpdatedActivities().subscribe(launchActivity => {
      self.launchActivities = launchActivity;
    });
    this.launchActivities = launchActivityService.getActivities();
  }

  ngOnInit(): void {
    this.launchActivities.forEach(activity => {
      let medium: string;
      if (this.isDisk(activity.game)) {
        medium = activity.game.diskA;
      } else if (this.isTape(activity.game)) {
        medium = activity.game.tape;
      } else {
        medium = null;
      }
      if (medium) {
        this.launchActivityService.getFileGroup(activity.pid, medium).then((fileGroup: string[]) => {
          this.fileGroupMap.set(activity.pid, fileGroup);
        });
      }
    })
  }

  ngOnDestroy() {
    this.launchActivitySubscription.unsubscribe();
  }

  getMediumDisplayName(medium: string) {
    let separatorIndex = medium.lastIndexOf('\\');
    if (separatorIndex < 0) {
      separatorIndex = medium.lastIndexOf('/')
    }
    return medium.substring(separatorIndex + 1, medium.lastIndexOf('.'));
  }

  isMediumCanHaveGroup(game: Game): boolean {
    return this.isDisk(game) || this.isTape(game);
  }

  getTimeDisplay(time: number): string {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();

    return hours + ':' + minutes.substring(-2) + ':' + seconds.substring(-2);
  }

  switchMedium(pid: number, game: Game, medium: string) {
    if (this.isDisk(game)) {
      this.launchActivityService.switchDisk(pid, medium);
    } else {
      this.launchActivityService.switchTape(pid, medium);
    }
  }

  resetMachine(pid: number) {
    this.launchActivityService.resetMachine(pid);
  }

  private isDisk(game: Game) {
    return game.romA == null && game.diskA != null;
  }

  private isTape(game: Game) {
    return game.romA == null && game.diskA == null && game.tape != null;
  }
}
