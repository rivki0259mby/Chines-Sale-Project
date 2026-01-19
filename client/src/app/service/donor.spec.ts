import { TestBed } from '@angular/core/testing';

import { DonorSevice } from './donor';

describe('Donor', () => {
  let service: DonorSevice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonorSevice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
