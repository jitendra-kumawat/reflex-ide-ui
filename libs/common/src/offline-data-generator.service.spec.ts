import { TestBed, inject } from '@angular/core/testing';

import { OfflineDataGeneratorService } from './offline-data-generator.service';

describe('OfflineDataGeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OfflineDataGeneratorService]
    });
  });

  it(
    'should be created',
    inject([OfflineDataGeneratorService], (service: OfflineDataGeneratorService) => {
      expect(service).toBeTruthy();
    })
  );
});
