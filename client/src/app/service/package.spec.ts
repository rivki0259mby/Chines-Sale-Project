import { TestBed } from '@angular/core/testing';

import { PackageService } from './package';

describe('Package', () => {
  let service: PackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
