import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { BehaviorSubject, Observable } from 'rxjs';

declare let require: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3PasswordService {
  private PASSWORD_ARTIFACTS = require('../../../build/contracts/Password.json');
  public web3: Web3;

  private contractABI = this.PASSWORD_ARTIFACTS;
  public contract: any;
  private isWeb3PassordReady: BehaviorSubject<boolean>;
  public isWeb3PassordReady$: Observable<boolean>
  public owner: string = '';
  public success: boolean = false;

  constructor() {
    this.isWeb3PassordReady = new BehaviorSubject(false);
    this.isWeb3PassordReady$ = this.isWeb3PassordReady.asObservable();
    this.initContract();
  }

  private initContract() {
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
    this.initWeb3();
  }

  private initWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.ethereum !== 'undefined') {
      // Use Mist/MetaMask's provider
      window.ethereum.enable().then(async () => {
        let contractAddress = "0xc407af10D4962289A781C670421b46657b3166FD"; //ropsten TODO: need to change for metamask when ready.
        alert('Connecting to MetaMask');
        this.web3 = new Web3(window.ethereum);
        this.contract = new this.web3.eth.Contract(
          this.contractABI.abi,
          contractAddress
        );
        this.initEventSubscriptions();
        this.isWeb3PassordReady.next(true);
      });
    } else {
      alert('No web3? You should consider trying MetaMask!');

      let contractAddress = "0xc407af10D4962289A781C670421b46657b3166FD";
      this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545')); // this allows for the allEvents to work.
      this.contract = new this.web3.eth.Contract(
        this.contractABI.abi,
        contractAddress
      );
      this.initEventSubscriptions();
      this.isWeb3PassordReady.next(true);
    }
  }

  private initEventSubscriptions(): void {
    this.contract.events.allEvents({ fromBlock: 'latest' }, async (error, event) => {
      if (!error) {
        //alert(JSON.stringify(event));
        this.success = true;
        console.log('event=', event);
      } else {
        this.success = false;
        console.log('error=', error);
        //alert(JSON.stringify(error))
      }
      // if (event.returnValues._deliveryHash) {
      //   const deliveryHash = event.returnValues._deliveryHash;
      //   const delivery = await this.getDelivery(deliveryHash);
      //   this.deliveryStream.next(delivery);
      // }
    });
  }
}
