import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class EmulatorService {
  private ipc: IpcRenderer;

  constructor() {
    this.ipc = window.require('electron').ipcRenderer;
  }

  async getMachines(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once('getMachinesResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getMachines');
    });
  }

  async getExtensions(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once('getExtensionsResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getExtensions');
    });
  }

  async getWebMSXPath(folder: string, file: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.ipc.once('getWebMSXPathResponse', (event, fullpath: string) => {
        resolve(fullpath);
      });
      this.ipc.send('getWebMSXPath', folder, file);
    });
  }
}
