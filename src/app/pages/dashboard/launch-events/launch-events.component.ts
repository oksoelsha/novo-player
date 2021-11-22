import { Component, OnInit } from '@angular/core';
import { Event, EventSource } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'dashboard-launch-events-card',
  templateUrl: './launch-events.component.html',
  styleUrls: ['../dashboard.component.sass', './launch-events.component.sass']
})
export class LaunchEventsComponent implements OnInit {

  private readonly pageSize: number = 6;
  events: Event[] = [];
  total: number = 0;
  currentPage: number = 0;

  constructor(private eventsService: EventsService) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getTotalPages(): number {
    return Math.trunc((this.total -1) / this.pageSize) + 1;
  }

  getCurrentPage(): number {
    return this.currentPage + 1;
  }

  getEventDate(timestamp: number): string {
    let date = new Date(timestamp);
    return ("0" + date.getDate()).slice(-2) + "-" + (date.getMonth() + 1) + " " +
      ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
  }

  getLaunchSource(source: number): string {
    return EventSource[source];
  }

  nextPage() {
    this.currentPage++;
    this.getEvents();
  }

  previousPage() {
    this.currentPage--;
    this.getEvents();
  }

  lastPage() {
    this.currentPage = this.getTotalPages() - 1;
    this.getEvents();
  }

  firstPage() {
    this.currentPage = 0;
    this.getEvents();
  }

  private getEvents() {
    this.eventsService.getEvents(this.pageSize, this.currentPage).then((data: any) => {
      this.total = data.total;
      this.events = data.events;
    });
  }
}
