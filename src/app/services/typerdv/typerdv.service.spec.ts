import { TestBed } from '@angular/core/testing';

import { TyperdvService } from './typerdv.service';

describe('TyperdvService', () => {
  let service: TyperdvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TyperdvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
