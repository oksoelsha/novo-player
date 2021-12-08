import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private ipc: IpcRenderer;

  constructor() {
    if ((<any> window).require) {
      try {
        this.ipc = (<any> window).require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }

  logEvent(event: Event) {
    this.ipc.send('logEvent', event);
  }

  async getEvents(pageSize: number, currentPage: number): Promise<Event[]> {
    return new Promise<Event[]>((resolve, reject) => {
      this.ipc.once('getEventsResponse', (event, eventsData) => {
        resolve(eventsData);
      });
      this.ipc.send('getEvents', pageSize, currentPage);
    });
  }
}
