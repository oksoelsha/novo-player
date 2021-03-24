import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Totals } from 'src/app/models/totals';
import { GamesService } from 'src/app/services/games.service';
import { ScannerService } from 'src/app/services/scanner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private totalsSubscription: Subscription;
  totalsSubject: Subject<Totals> = new Subject<Totals>();

  constructor(private gamesService: GamesService, private scannerService: ScannerService) {
    this.totalsSubscription = this.scannerService.getScannerFinishedEvent().subscribe(() => {
      this.getTotals();
    });
  }

  ngOnInit() {
    this.getTotals();
  }

  ngOnDestroy() {
    this.totalsSubscription.unsubscribe();
  }

  private getTotals() {
    this.gamesService.getTotals().then((totals: Totals) => {
      this.totalsSubject.next(totals);
    });
  }
}