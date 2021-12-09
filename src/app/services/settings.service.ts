import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private ipc: IpcRenderer;

  constructor() {
    this.ipc = window.require('electron').ipcRenderer;
  }

  getSettings(): Promise<Settings> {
    return new Promise<Settings>((resolve, reject) => {
      this.ipc.once('getSettingsResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getSettings');
    });
  }

  saveSettings(settings: Settings) {
    this.ipc.send('saveSettings', settings);
  }
}
