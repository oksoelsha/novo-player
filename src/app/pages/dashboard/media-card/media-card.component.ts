import { Component, Input, OnInit } from '@angular/core';
import { ApexChart, ApexNonAxisChartSeries, ApexStroke } from 'ng-apexcharts';
import { Observable } from 'rxjs';
import { LocalizationService } from 'src/app/internationalization/localization.service';
import { Totals } from 'src/app/models/totals';

@Component({
  selector: 'app-dashboard-media-card',
  templateUrl: './media-card.component.html',
  styleUrls: ['../dashboard.component.sass', './media-card.component.sass']
})
export class MediaCardComponent implements OnInit {

  @Input() totalsEvent: Observable<Totals>;

  readonly chart: ApexChart = {
    type: 'donut',
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
  readonly labels: string[] = [
    this.localizationService.translate('dashboard.roms'), 
    this.localizationService.translate('dashboard.disks'),
    this.localizationService.translate('dashboard.tapes'),
    this.localizationService.translate('dashboard.harddisks'),
    this.localizationService.translate('dashboard.laserdiscs')
  ];
  readonly legend: any = {
    position: 'right',
    fontSize: '12px',
    labels: {
      colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']
    }
  };
  series: ApexNonAxisChartSeries = [];

  constructor(private localizationService: LocalizationService) { }

  ngOnInit(): void {
    this.totalsEvent.subscribe((totals: Totals) => {
      this.series = [totals.roms, totals.disks, totals.tapes, totals.harddisks, totals.laserdiscs];
    });
  }
}
