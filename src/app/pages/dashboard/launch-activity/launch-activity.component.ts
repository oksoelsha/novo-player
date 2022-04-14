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
      this.launchActivityService.getFileGroup(activity.pid, activity.game).then((fileGroup: string[]) => {
        this.fileGroupMap.set(activity.pid, fileGroup);
      });
    })
  }

  ngOnDestroy() {
    this.launchActivitySubscription.unsubscribe();
  }

  getMediumDisplayName(medium: string) {
    //FIX IT FOR non-WINDOWS
    return medium.substring(medium.lastIndexOf('\\') + 1, medium.lastIndexOf('.'));
  }

  getTimeDisplay(time: number): string {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();

    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }

  switchDisk(pid: number, medium: string) {
    this.launchActivityService.switchDisk(pid, medium);
  }

  resetMachine(pid: number) {
    this.launchActivityService.resetMachine(pid);
  }
}
