import { TestBed } from '@angular/core/testing';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { DeactivateGuardService } from './deactivate-guard.service';


describe('DeactivateGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BsModalService
    ],
    imports: [ModalModule.forRoot()]
  }));

  it('should be created', () => {
    const service: DeactivateGuardService = TestBed.get(DeactivateGuardService);
    expect(service).toBeTruthy();
  });
});
