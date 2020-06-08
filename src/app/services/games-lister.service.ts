import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GamesListerService {
  private ipc: IpcRenderer

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer
      } catch (error) {
        throw error
      }
    } else {
      console.warn('Could not load electron ipc')
    }
  }

  async getGames(): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      this.ipc.once("getGamesResponse", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("getGames");
    });
  }

  launchGame(game: Game) {
    this.ipc.send("launchGame", game);
  }
}
