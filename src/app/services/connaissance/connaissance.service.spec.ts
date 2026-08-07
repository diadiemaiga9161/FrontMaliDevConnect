import { TestBed } from '@angular/core/testing';

import { ConnaissanceService } from './connaissance.service';

describe('ConnaissanceService', () => {
  let service: ConnaissanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnaissanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
