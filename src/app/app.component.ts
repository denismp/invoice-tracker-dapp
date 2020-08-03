import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Web3Service } from './services/web3.service';
import { Web3PasswordService } from './services/web3-password.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'invoice-dapp';
  active = 1;
  public isWeb3Ready = false;
  public isPasswordWeb3Ready = false;
  private subscription = new Subscription()

  constructor(private web3Service: Web3Service, private web3PasswordService: Web3PasswordService) {
    this.listenToIsWeb3Ready();
    this.listenToIsPasswordWeb3Ready();
  }

  private listenToIsWeb3Ready(): void {
    this.web3Service.isWeb3Ready$.subscribe(async isReady => {
      if (isReady) {
        this.isWeb3Ready = isReady;
        const accounts = await this.web3Service.web3.eth.getAccounts();
        this.web3Service.owner = accounts[0];
      }
    });
  }

  private listenToIsPasswordWeb3Ready(): void {
    this.web3PasswordService.isWeb3Ready$.subscribe(async isReady => {
      if (isReady) {
        this.isPasswordWeb3Ready = isReady;
        const accounts = await this.web3PasswordService.web3.eth.getAccounts();
        this.web3PasswordService.owner = accounts[0];
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
