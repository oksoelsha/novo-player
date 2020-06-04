import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private subject = new Subject<string>();

  constructor() { }

  sendMessage(msg: string) {
    this.subject.next(msg);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
