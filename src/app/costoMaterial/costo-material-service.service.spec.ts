import { TestBed } from '@angular/core/testing';

import { CostoMaterialServiceService } from './costo-material-service.service';

describe('CostoMaterialServiceService', () => {
  let service: CostoMaterialServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostoMaterialServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
