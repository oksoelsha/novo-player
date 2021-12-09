import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LaunchActivity, LaunchActivityService } from 'src/app/services/launch-activity.service';

@Component({
  selector: 'app-dashboard-launch-activity-card',
  templateUrl: './launch-activity.component.html',
  styleUrls: ['../../../common-styles.sass', '../dashboard.component.sass', './launch-activity.component.sass']
})
export class LaunchActivityComponent implements OnDestroy {

  private launchActivitySubscription: Subscription;
  launchActivities: LaunchActivity[] = [];

  constructor(private launchActivityService: LaunchActivityService) {
    const self = this;
    this.launchActivitySubscription = this.launchActivityService.getUpdatedActivities().subscribe(launchActivity => {
      self.launchActivities = launchActivity;
    });
    this.launchActivities = launchActivityService.getActivities();
  }

  ngOnDestroy() {
    this.launchActivitySubscription.unsubscribe();
  }

  getTimeDisplay(time: number): string {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();

    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }
}
