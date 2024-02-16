import { TestBed } from '@angular/core/testing';

import { TypeConnaissanceService } from './type-connaissance.service';

describe('TypeConnaissanceService', () => {
  let service: TypeConnaissanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeConnaissanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
