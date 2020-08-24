import { Component, OnDestroy  } from '@angular/core';
import { AlertsService, AlertType } from './alerts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.sass']
})
export class AlertsComponent implements OnDestroy {

  private alertMessage: string = "";
  private alertClass: string = "";
  private subscription: Subscription;
  private timer: NodeJS.Timer = null;

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
    if (this.timer != null) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.resetFields();
    }, 5000);
  }

  private resetFields() {
    this.alertMessage = "";
    this.alertClass = "";
  }
}
