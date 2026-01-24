import { TestBed } from '@angular/core/testing';

import { giftModel } from '../models/Gift.model';
describe('Gift', () => {
  let service: giftModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(giftModel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
