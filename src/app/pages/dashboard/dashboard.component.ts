import { Component, OnInit } from '@angular/core';
import { ApexChart, ApexNonAxisChartSeries, ApexStroke } from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { Totals } from 'src/app/models/totals';
import { GamesService } from 'src/app/services/games.service';
import { LaunchActivity, LaunchActivityService } from 'src/app/services/launch-activity.service';
import { ScannerService } from 'src/app/services/scanner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  private launchActivitySubscription: Subscription;
  private totalsSubscription: Subscription;

  totals: any = [];

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

  constructor(private gamesService: GamesService, private launchActivityService: LaunchActivityService, private scannerService: ScannerService) {
    var self = this;
    this.launchActivitySubscription = this.launchActivityService.getUpdatedActivities().subscribe(launchActivity => {
      self.launchActivities = launchActivity;
    });

    this.totalsSubscription = this.scannerService.getScannerFinishedEvent().subscribe(() => {
      this.getTotals();
    })

    this.launchActivities = launchActivityService.getActivities();
  }

  ngOnInit() {
    this.getTotals();
  }

  getTimeDisplay(time: number): string {
    var date = new Date(time);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();

    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }

  private getTotals() {
    this.gamesService.getTotals().then((totals: Totals) => {
      this.updateTotals(totals);
      this.updateGraph(totals);
    });
  }

  private updateTotals(totals: Totals) {
    this.totals = [
      { name: "Listings", value: totals.listings },
      { name: "Games", value: totals.games },
      { name: "ROMs", value: totals.roms },
      { name: "Disks", value: totals.disks },
      { name: "Tapes", value: totals.tapes },
      { name: "Harddisks", value: totals.harddisks },
      { name: "Laserdiscs", value: totals.laserdiscs }
    ];
  }

  private updateGraph(totals: Totals) {
    this.series = [totals.roms, totals.disks, totals.tapes, totals.harddisks, totals.laserdiscs];
  }
}