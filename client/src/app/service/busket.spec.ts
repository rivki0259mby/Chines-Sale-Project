import { TestBed } from '@angular/core/testing';

import { BusketService } from './busket';

describe('Busket', () => {
  let service: BusketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
