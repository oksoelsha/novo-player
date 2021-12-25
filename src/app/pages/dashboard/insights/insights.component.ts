import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-dashboard-insights-card',
  templateUrl: './insights.component.html',
  styleUrls: ['../dashboard.component.sass', './insights.component.sass']
})
export class InsightsComponent implements OnInit {

  readonly pageSize = 5;
  topTenList: any[] = [];
  total = 0;

  constructor(private eventsService: EventsService) { }

  ngOnInit(): void {
    this.getTopTenLaunchedGames(0);
  }

  getTopTenLaunchedGames(page: number) {
    this.eventsService.getTopTenLaunchedGames(this.pageSize, page).then((data: any) => {
      this.total = data.total;
      this.topTenList = data.counts;
    });
  }

}
