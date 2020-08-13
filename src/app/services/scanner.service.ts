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

  scan(folders: string[]): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.ipc.once("scanResponse", (event, totalAddedToDatabase) => {
        resolve(totalAddedToDatabase);
      });
      this.ipc.send("scan", folders);
    });
  }

}
