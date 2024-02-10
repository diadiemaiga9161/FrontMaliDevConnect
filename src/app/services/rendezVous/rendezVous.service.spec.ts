import { TestBed } from '@angular/core/testing';

import { RendezVous, RendezVousService } from './rendezVous.service';

describe('RendezVous', () => {
  let service: RendezVous;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RendezVousService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
