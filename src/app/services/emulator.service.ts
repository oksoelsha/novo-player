import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class EmulatorService {
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

  async getMachines(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once("getMachinesResponse", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("getMachines");
    });
  }

  async getExtensions(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once("getExtensionsResponse", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("getExtensions");
    });
  }
}
