import { Component, OnInit } from '@angular/core';
import { Event, EventSource } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'dashboard-launch-events-card',
  templateUrl: './launch-events.component.html',
  styleUrls: ['../dashboard.component.sass', './launch-events.component.sass']
})
export class LaunchEventsComponent implements OnInit {

  readonly pageSize = 6;
  events: Event[] = [];
  total = 0;

  constructor(private eventsService: EventsService) { }

  ngOnInit(): void {
    this.getEvents(0);
  }

  getEventDate(timestamp: number): string {
    const date = new Date(timestamp);
    return ('0' + date.getDate()).slice(-2) + '-' + (date.getMonth() + 1) + ' ' +
      ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
  }

  getLongEventDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  getLaunchSource(source: number): string {
    return EventSource[source];
  }

  private getEvents(page: number) {
    this.eventsService.getEvents(this.pageSize, page).then((data: any) => {
      this.total = data.total;
      this.events = data.events;
    });
  }
}
