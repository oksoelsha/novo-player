import { Component, Input, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'app-elapsed-time',
  templateUrl: './elapsed-time.component.html',
  styleUrls: ['./elapsed-time.component.sass']
})
export class ElapsedTimeComponent implements OnInit {

  @Input() startTime: number;
  private now: number;
  private timer: Observable<number> = interval(2000); //every 2 seconds rather than 1 second is ok
  shortTime: boolean;
  elapsedTime: any;

  constructor() { }

  ngOnInit(): void {
    this.updateTimes();
    this.timer.subscribe(val => this.updateTimes());
  }

  getStartTimeDisplay(): string {
    return new Date(this.startTime).toTimeString();
  }

  private updateTimes() {
    this.now = Date.now()
    this.shortTime = (this.now - this.startTime) < 60000;
    if (!this.shortTime) {
      this.elapsedTime = this.getElapsedTime();
    }
  }

  private getElapsedTime(): any {
    let diff:number = this.now - this.startTime;
    let hours = Math.floor((diff % 86400000) / 3600000);
    let minutes = Math.floor((diff % 3600000) / 60000);

    return {
      hours: hours,
      minutes: minutes
    };
  }
}
