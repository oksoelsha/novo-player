import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalizationService } from 'src/app/internationalization/localization.service';
import { Totals } from 'src/app/models/totals';

@Component({
  selector: 'app-dashboard-totals-card',
  templateUrl: './totals-card.component.html',
  styleUrls: ['../dashboard.component.sass', './totals-card.component.sass']
})
export class TotalsCardComponent implements OnInit {

  @Input() totalsEvent: Observable<Totals>;
  totals: any = [];

  constructor(private localizationService: LocalizationService) { }

  ngOnInit(): void {
    this.totalsEvent.subscribe((totals: Totals) => {
      this.totals = [
        { name: this.localizationService.translate('dashboard.listings'), value: totals.listings },
        { name: this.localizationService.translate('dashboard.games'), value: totals.games },
        { name: this.localizationService.translate('dashboard.roms'), value: totals.roms },
        { name: this.localizationService.translate('dashboard.disks'), value: totals.disks },
        { name: this.localizationService.translate('dashboard.tapes'), value: totals.tapes },
        { name: this.localizationService.translate('dashboard.harddisks'), value: totals.harddisks },
        { name: this.localizationService.translate('dashboard.laserdiscs'), value: totals.laserdiscs }
      ];
    });
  }
}

