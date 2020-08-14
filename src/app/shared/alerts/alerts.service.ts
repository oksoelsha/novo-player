import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private subject = new Subject<Alert>();

  constructor() { }

  success(msg: string) {
    this.subject.next(new Alert(msg, AlertType.Success));
  }

  failure(msg: string) {
    this.subject.next(new Alert(msg, AlertType.Failure));
  }

  info(msg: string) {
    this.subject.next(new Alert(msg, AlertType.Info));
  }

  getAlert(): Observable<Alert> {
    return this.subject.asObservable();
  }
}

class Alert {
  message: string;
  type: AlertType;

  constructor(message: string, type: AlertType) {
    this.message = message;
    this.type = type;
  }
}

export enum AlertType {
  Success,
  Failure,
  Info
}
