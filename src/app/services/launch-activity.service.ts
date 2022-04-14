import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Observable, Subject } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class LaunchActivityService {

  private subject = new Subject<LaunchActivity[]>();
  private launchActivities: LaunchActivity[] = [];
  private ipc: IpcRenderer;

  constructor() {
    this.ipc = window.require('electron').ipcRenderer;
  }

  recordGameStart(game: Game, time: number, pid: number) {
    this.launchActivities.push(new LaunchActivity(game, time, pid));
    this.subject.next(this.launchActivities);
  }

  recordGameFinish(game: Game, time: number) {
    let index: number;
    for (index = 0; index < this.launchActivities.length &&
      (this.launchActivities[index].game.name !== game.name || this.launchActivities[index].time !== time); index++) {}
    this.launchActivities.splice(index, 1);
    this.subject.next(this.launchActivities);
  }

  getActivities(): LaunchActivity[] {
    return this.launchActivities;
  }

  getUpdatedActivities(): Observable<LaunchActivity[]> {
    return this.subject.asObservable();
  }

  getFileGroup(pid: number, game: Game): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once('getFileGroupResponse' + pid, (event: any, fileGroup: string[]) => {
        resolve(fileGroup);
      });
      //TODO Send main file: disk or tape
      this.ipc.send('getFileGroup', pid, game.diskA);
    });
  }

  switchDisk(pid: number, medium: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.ipc.once('switchDiskOnOpenmsxResponse', (event: any, switched: boolean) => {
        resolve(switched);
      });
      this.ipc.send('switchDiskOnOpenmsx', pid, medium);
    });
  }

  resetMachine(pid: number) {
    return new Promise<boolean>((resolve, reject) => {
      this.ipc.once('resetOnOpenmsxResponse', (event: any, reset: boolean) => {
        resolve(reset);
      });
      this.ipc.send('resetOnOpenmsx', pid);
    });
  }
}

export class LaunchActivity {
  game: Game;
  time: number;
  pid: number;

  constructor(game: Game, time: number, pid: number) {
    this.game = game;
    this.time = time;
    this.pid = pid;
  }
}
