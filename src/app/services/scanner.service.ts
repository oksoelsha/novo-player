import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
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

  scan(folders: string[]): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      this.ipc.once("scanResponse", (event, games) => {
        resolve(games);
      });
      this.ipc.send("scan", folders);
    });
  }

}
