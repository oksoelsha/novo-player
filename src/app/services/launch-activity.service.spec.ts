import { TestBed } from '@angular/core/testing';

import { LaunchActivityService } from './launch-activity.service';

describe('LaunchActivityService', () => {
  let service: LaunchActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaunchActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
