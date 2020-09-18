import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Game } from '../models/game';
import { ScreenshotData } from '../models/screenshot-data';

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
      this.ipc.once("getGamesResponse", (event, games) => {
        games.sort((a: Game, b: Game) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        resolve(games);
      });
      this.ipc.send("getGames");
    });
  }

  launchGame(game: Game) {
    this.ipc.send("launchGame", game);
  }

  async getMachines(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once("getMachinesResponse", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("getMachines");
    });
  }

  async saveGame(game: Game) {
    return new Promise<boolean>((resolve, reject) => {
      this.ipc.once("saveGameResponse", (event, removed: boolean) => {
        resolve(removed);
      });
      this.ipc.send("saveGame", game);
    });
  }

  async removeGame(game: Game) {
    return new Promise<boolean>((resolve, reject) => {
      this.ipc.once("removeGameResponse", (event, removed: boolean) => {
        resolve(removed);
      });
      this.ipc.send("removeGame", game);
    });
  }

  getScreenshot(game: Game): Promise<ScreenshotData> {
    return new Promise<ScreenshotData>((resolve, reject) => {
      this.ipc.once("getScreenshotResponse" + game.sha1Code, (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("getScreenshot", game.sha1Code, game.generationMSXId, game.screenshotSuffix);
    });
  }
}