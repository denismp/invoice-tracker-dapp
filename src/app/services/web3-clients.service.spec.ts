import { TestBed } from '@angular/core/testing';

import { Web3ClientsService } from './web3-clients.service';

describe('Web3ClientsService', () => {
  let service: Web3ClientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3ClientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
