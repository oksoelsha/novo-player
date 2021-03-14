import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class LaunchActivityService {

  private subject = new Subject<LaunchActivity[]>();
  private launchActivities: LaunchActivity[] = [];

  constructor() { }

  recordGameStart(game: Game, time: number) {
    this.launchActivities.push(new LaunchActivity(game, time));
    this.subject.next(this.launchActivities);
  }

  recordGameFinish(game: Game, time: number) {
    let index: number;
    for (index = 0; index < this.launchActivities.length &&
      (this.launchActivities[index].game.name != game.name || this.launchActivities[index].time != time); index++);
    this.launchActivities.splice(index, 1);
    this.subject.next(this.launchActivities);
  }

  getActivities(): LaunchActivity[] {
    return this.launchActivities;
  }

  getUpdatedActivities(): Observable<LaunchActivity[]> {
    return this.subject.asObservable();
  }
}

export class LaunchActivity {
  game: Game;
  time: number;

  constructor(game: Game, time:number) {
    this.game = game;
    this.time = time;
  }
}
