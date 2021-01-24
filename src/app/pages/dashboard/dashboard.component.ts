import { Component, OnInit } from '@angular/core';
import { Stats } from 'src/app/models/stats';
import { GamesListerService } from 'src/app/services/games-lister.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  private stats = [];

  constructor(private gamesLister: GamesListerService) { }

  ngOnInit() {
    this.gamesLister.getStats().then((data: Stats) => {
      this.stats = [
        { name: "Total Listings", value: data.totalListings },
        { name: "Total Games", value: data.totalGames },
        { name: "Total ROMs", value: data.totalRoms },
        { name: "Total Disks", value: data.totalDisks },
        { name: "Total Tapes", value: data.totalTapes },
        { name: "Total Harddisks", value: data.totalHarddisks },
        { name: "Total Laserdiscs", value: data.totalLaserdiscs },
      ]
    });
  }
}