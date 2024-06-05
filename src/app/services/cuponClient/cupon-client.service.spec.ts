import { TestBed } from '@angular/core/testing';

import { CuponClientService } from './cupon-client.service';

describe('CuponClientService', () => {
  let service: CuponClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuponClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
