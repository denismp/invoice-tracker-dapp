import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Web3ClientsService } from './services/web3-clients.service';
import { Web3InvoicesService } from './services/web3-invoices.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'invoice-dapp';
  active = 1;
  public isWeb3InvoicesReady = false;
  public isClientsWeb3Ready = false;
  private subscription = new Subscription()

  constructor(private web3InvoicesService: Web3InvoicesService, private web3ClientsService: Web3ClientsService) {
    this.listenToIsWeb3InvoicesReady();
    this.listenToIsClientsWeb3Ready();
  }

  private listenToIsWeb3InvoicesReady(): void {
    this.web3InvoicesService.isWeb3InvoicesReady$.subscribe(async isReady => {
      if (isReady) {
        this.isWeb3InvoicesReady = isReady;
        const accounts = await this.web3InvoicesService.web3.eth.getAccounts();
        this.web3InvoicesService.owner = accounts[0];
      }
    });
  }

  private listenToIsClientsWeb3Ready(): void {
    this.web3ClientsService.isWeb3ClientsReady$.subscribe(async isReady => {
      if (isReady) {
        this.isClientsWeb3Ready = isReady;
        const accounts = await this.web3ClientsService.web3.eth.getAccounts();
        this.web3ClientsService.owner = accounts[0];
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
