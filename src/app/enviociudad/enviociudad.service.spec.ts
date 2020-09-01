import { TestBed } from '@angular/core/testing';

import { EnviociudadService } from './enviociudad.service';

describe('EnviociudadService', () => {
  let service: EnviociudadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnviociudadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
