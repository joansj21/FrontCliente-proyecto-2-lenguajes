import { TestBed } from '@angular/core/testing';

import { CuponService } from './cupon.service';

describe('CuponService', () => {
  let service: CuponService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
