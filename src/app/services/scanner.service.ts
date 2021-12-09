import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Observable, Subject } from 'rxjs';
import { Game } from '../models/game';
import { ScanParameters } from '../popups/scan-parameters/scan-parameters.component';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  private ipc: IpcRenderer;
  private subject = new Subject<void>();

  constructor() {
    this.ipc = window.require('electron').ipcRenderer;
  }

  scan(parameters: ScanParameters): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.ipc.once('scanResponse', (event, totalAddedToDatabase) => {
        if (totalAddedToDatabase > 0) {
          this.subject.next();
        }
        resolve(totalAddedToDatabase);
      });
      this.ipc.send('scan', parameters.items, parameters.listing, parameters.machine);
    });
  }

  getScannerFinishedEvent(): Observable<void> {
    return this.subject.asObservable();
  }
}
