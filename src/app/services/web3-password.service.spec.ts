import { TestBed } from '@angular/core/testing';

import { Web3PasswordService } from './web3-password.service';

describe('Web3PasswordService', () => {
  let service: Web3PasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3PasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
