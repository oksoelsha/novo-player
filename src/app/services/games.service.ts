import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Game } from '../models/game';
import { GameSecondaryData } from '../models/secondary-data';
import { Totals } from '../models/totals';
import { LaunchActivityService } from './launch-activity.service';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private ipc: IpcRenderer;

  constructor(private launchActivityService: LaunchActivityService) {
    this.ipc = window.require('electron').ipcRenderer;
  }

  async getListings(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once('getListingsResponse', (event, listings) => {
        listings.sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()));
        resolve(listings);
      });
      this.ipc.send('getListings');
    });
  }

  async getGames(listing: string): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      this.ipc.once('getGamesResponse', (event, games) => {
        games.sort((a: Game, b: Game) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        resolve(games);
      });
      this.ipc.send('getGames', listing);
    });
  }

  launchGame(game: Game): Promise<string> {
    const time: number = Date.now();
    this.launchActivityService.recordGameStart(game, time);
    return new Promise<string>((resolve, reject) => {
      this.ipc.once('launchGameResponse' + time, (event, errorMessage: string) => {
        // this resolving means that either openMSX failed to start or the window was closed
        this.launchActivityService.recordGameFinish(game, time);
        resolve(errorMessage);
      });
      this.ipc.send('launchGame', game, time);
    });
  }

  async saveGame(game: Game) {
    return new Promise<boolean>((resolve, reject) => {
      this.ipc.once('saveGameResponse', (event, removed: boolean) => {
        resolve(removed);
      });
      this.ipc.send('saveGame', game);
    });
  }

  async removeGame(game: Game) {
    return new Promise<boolean>((resolve, reject) => {
      this.ipc.once('removeGameResponse', (event, removed: boolean) => {
        resolve(removed);
      });
      this.ipc.send('removeGame', game);
    });
  }

  async updateGame(oldGame: Game, newGame: Game) {
    return new Promise<boolean>((resolve, reject) => {
      this.ipc.once('updateGameResponse', (event, err: boolean) => {
        resolve(err);
      });
      this.ipc.send('updateGame', oldGame, newGame);
    });
  }

  getSecondaryData(game: Game): Promise<GameSecondaryData> {
    return new Promise<GameSecondaryData>((resolve, reject) => {
      this.ipc.once('getSecondaryDataResponse' + game.sha1Code, (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getSecondaryData', game.sha1Code, game.generationMSXId, game.screenshotSuffix);
    });
  }

  exploreFile(file: string) {
    this.ipc.send('openFileExplorer', file);
  }

  async getTotals(): Promise<Totals> {
    return new Promise<Totals>((resolve, reject) => {
      this.ipc.once('getTotalsResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getTotals');
    });
  }

  async getSearch(text: string): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      this.ipc.once('searchResponse_' + text, (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('search', text);
    });
  }

  async renameListing(oldName: string, newName: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.ipc.once('renameListingResponse', (event, err: boolean) => {
        resolve(err);
      });
      this.ipc.send('renameListing', oldName, newName);
    });
  }

  async deleteListing(name: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.ipc.once('deleteListingResponse', (event, removed: boolean) => {
        resolve(removed);
      });
      this.ipc.send('deleteListing', name);
    });
  }

  async setFavoritesFlag(game: Game, flag: boolean) {
    return new Promise<boolean>((resolve, reject) => {
      this.ipc.once('setFavoritesFlagResponse', (event, err: boolean) => {
        resolve(err);
      });
      this.ipc.send('setFavoritesFlag', game, flag);
    });
  }

  async getFavorites(): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      this.ipc.once('getFavoritesResponse', (event, favorites) => {
        resolve(favorites);
      });
      this.ipc.send('getFavorites');
    });
  }
}
