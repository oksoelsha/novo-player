import { Component, OnInit } from '@angular/core';
import { ApexChart, ApexNonAxisChartSeries, ApexStroke } from 'ng-apexcharts';
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

  readonly chart: ApexChart = {
    type: "donut",
    animations: {
      dynamicAnimation: {
        enabled: true,
        speed: 800
      }
    }
  };
  readonly stroke: ApexStroke = {
    width: 0
  };
  readonly labels: string[] = ["ROMs", "Disks", "Tapes", "Harddisks", "Laserdics"];
  readonly legend: any = {
    position: 'right',
    fontSize: '12px',
    labels: {
      colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']
    }
  };
  series: ApexNonAxisChartSeries = [];

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

      this.series = [data.totalRoms, data.totalDisks, data.totalTapes, data.totalHarddisks, data.totalLaserdiscs];
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