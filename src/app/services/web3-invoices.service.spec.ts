import { TestBed } from '@angular/core/testing';

import { Web3InvoicesService } from './web3-invoices.service';

describe('Web3InvoicesService', () => {
  let service: Web3InvoicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3InvoicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
