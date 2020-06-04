import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
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

  getSettings(): Promise<Settings> {
    return new Promise<Settings>((resolve, reject) => {
      this.ipc.once("getSettingsResponse", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("getSettings");
    });
  }

  saveSettings(settings: Settings) {
    this.ipc.send("saveSettings", settings);
  }
}
