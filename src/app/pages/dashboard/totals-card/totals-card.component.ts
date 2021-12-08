import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Totals } from 'src/app/models/totals';

@Component({
  selector: 'dashboard-totals-card',
  templateUrl: './totals-card.component.html',
  styleUrls: ['../dashboard.component.sass', './totals-card.component.sass']
})
export class TotalsCardComponent implements OnInit {

  @Input() totalsEvent: Observable<Totals>;
  totals: any = [];

  constructor() { }

  ngOnInit(): void {
    this.totalsEvent.subscribe((totals: Totals) => {
      this.totals = [
        { name: 'Listings', value: totals.listings },
        { name: 'Games', value: totals.games },
        { name: 'ROMs', value: totals.roms },
        { name: 'Disks', value: totals.disks },
        { name: 'Tapes', value: totals.tapes },
        { name: 'Harddisks', value: totals.harddisks },
        { name: 'Laserdiscs', value: totals.laserdiscs }
      ];
    });
  }
}

