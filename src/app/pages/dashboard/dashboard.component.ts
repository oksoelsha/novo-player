import { Component, OnInit } from '@angular/core';
import { ApexChart, ApexNonAxisChartSeries, ApexStroke } from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { Totals } from 'src/app/models/totals';
import { GamesService } from 'src/app/services/games.service';
import { LaunchActivity, LaunchActivityService } from 'src/app/services/launch-activity.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  private subscription: Subscription;

  totals = [];

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
    this.gamesService.getTotals().then((data: Totals) => {
      this.totals = [
        { name: "Listings", value: data.listings },
        { name: "Games", value: data.games },
        { name: "ROMs", value: data.roms },
        { name: "Disks", value: data.disks },
        { name: "Tapes", value: data.tapes },
        { name: "Harddisks", value: data.harddisks },
        { name: "Laserdiscs", value: data.laserdiscs },
      ];

      this.series = [data.roms, data.disks, data.tapes, data.harddisks, data.laserdiscs];
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