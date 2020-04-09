import { TestBed } from '@angular/core/testing';

import { DataReplayService } from './data-replay.service';

describe('DataReplayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataReplayService = TestBed.get(DataReplayService);
    expect(service).toBeTruthy();
  });
});
