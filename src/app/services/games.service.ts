import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Game } from '../models/game';
import { ScreenshotData } from '../models/screenshot-data';
import { Stats } from '../models/stats';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
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

  async getListings(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once("getListingsResponse", (event, listings) => {
        listings.sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()))
        resolve(listings);
      });
      this.ipc.send("getListings");
    });
  }

  async getGames(listing: string): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      this.ipc.once("getGamesResponse", (event, games) => {
        games.sort((a: Game, b: Game) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        resolve(games);
      });
      this.ipc.send("getGames", listing);
    });
  }

  launchGame(game: Game) {
    this.ipc.send("launchGame", game);
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

  async updateGame(oldGame: Game, newGame: Game) {
    return new Promise<boolean>((resolve, reject) => {
      this.ipc.once("updateGameResponse", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("updateGame", oldGame, newGame);
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

  async getStats(): Promise<Stats> {
    return new Promise<Stats>((resolve, reject) => {
      this.ipc.once("getStatsResponse", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("getStats");
    });
  }
}