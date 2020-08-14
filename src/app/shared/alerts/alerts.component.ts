import { Component, OnDestroy  } from '@angular/core';
import { AlertsService, AlertType } from './alerts.service';
import { Subscription, timer, Observable } from 'rxjs';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.sass']
})
export class AlertsComponent implements OnDestroy {

  alertMessage: string = "";
  alertClass: string = "";
  subscription: Subscription;
  waitTimer: Observable<number> = timer(5000);

  constructor(private alertService: AlertsService) {
    this.subscription = this.alertService.getAlert().subscribe(alert => {
      if (alert) {
        this.alertMessage = alert.message;
        this.alertClass = AlertType[alert.type];
        this.startTimer();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private startTimer() {
    this.waitTimer.subscribe(val => {
      this.resetFields();
    });
  }

  private resetFields() {
    this.alertMessage = "";
    this.alertClass = "";
  }
}
