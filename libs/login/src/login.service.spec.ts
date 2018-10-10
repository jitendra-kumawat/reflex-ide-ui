import { TestBed, inject } from '@angular/core/testing';

import { LoginService } from './login.service';

describe('LoginService', () => {
  const service: LoginService = new LoginService(undefined, undefined);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginService]
    });
  });

  it(
    'should be created', () => {
      expect(service).toBeTruthy();
    }
  );
});
