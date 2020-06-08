import { TestBed } from '@angular/core/testing';

import { GamesListerService } from './games-lister.service';

describe('GamesListerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamesListerService = TestBed.get(GamesListerService);
    expect(service).toBeTruthy();
  });
});
