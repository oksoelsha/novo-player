import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Stats } from 'src/app/models/stats';
import { GamesService } from 'src/app/services/games.service';
import { LaunchActivity, LaunchActivityService } from 'src/app/services/launch-activity.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  private subscription: Subscription;
  stats = [];
  launchActivities: LaunchActivity[] = [];

  constructor(private gamesService: GamesService, private launchActivityService: LaunchActivityService) {
    var self = this;
    this.subscription = this.launchActivityService.getUpdatedActivities().subscribe(launchActivity => {
      self.launchActivities = launchActivity;
    });

    this.launchActivities = launchActivityService.getActivities();
  }

  ngOnInit() {
    this.gamesService.getStats().then((data: Stats) => {
      this.stats = [
        { name: "Total Listings", value: data.totalListings },
        { name: "Total Games", value: data.totalGames },
        { name: "Total ROMs", value: data.totalRoms },
        { name: "Total Disks", value: data.totalDisks },
        { name: "Total Tapes", value: data.totalTapes },
        { name: "Total Harddisks", value: data.totalHarddisks },
        { name: "Total Laserdiscs", value: data.totalLaserdiscs },
      ];
    });
  }

  getTimeDisplay(time: number): string {
    var date = new Date(time);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();

    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }
}