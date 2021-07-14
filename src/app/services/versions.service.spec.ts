import { TestBed } from '@angular/core/testing';

import { VersionsService } from './versions.service';

describe('VersionsService', () => {
  let service: VersionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
