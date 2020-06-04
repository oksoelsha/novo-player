import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanDeactivate } from '@angular/router/src/utils/preactivation';
import { BsModalService } from 'ngx-bootstrap/modal';
import { merge, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmLeaveComponent } from '../shared/confirm-leave/confirm-leave.component';

export interface DeactivateComponent {
  canExit: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuardService implements CanDeactivate {
  component: Object;
  route: ActivatedRouteSnapshot;

  constructor(private modalService: BsModalService) { }

  canDeactivate(component: DeactivateComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!component.canExit()) {
      const subject = new Subject<boolean>();

      const modal = this.modalService.show(ConfirmLeaveComponent, {'class': 'modal-dialog-primary'});
      modal.content.subject = subject;

      const onHideObservable = this.modalService.onHide.pipe(map(x => false));
      return merge(subject.asObservable(), onHideObservable);
    }

    return true;
  }
}