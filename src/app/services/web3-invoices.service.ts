import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { BehaviorSubject, Observable } from 'rxjs';

declare let require: any;
declare let window: any

@Injectable({
  providedIn: 'root'
})
export class Web3InvoicesService {

  private INVOICE_ARTIFACTS = require('../../../build/contracts/Invoices.json');
  public web3: Web3;

  private contractABI = this.INVOICE_ARTIFACTS;
  public contract: any;
  private isWeb3InvoicesReady: BehaviorSubject<boolean>;
  public isWeb3InvoicesReady$: Observable<boolean>
  public owner: string = '';
  public success: boolean = false;

  constructor() {
    this.isWeb3InvoicesReady = new BehaviorSubject(false);
    this.isWeb3InvoicesReady$ = this.isWeb3InvoicesReady.asObservable();
    this.initContract();
  }

  private async initContract() {
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
    //this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545')); // this allows for the allEvents to work.
    //this.web3 = new Web3(new Web3.providers.HttpProvider('https://api.infura.io/v1/jsonrpc/ropsten')); // this allows for the allEvents to work.
    //this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // keeping this for future reference.
    await this.initWeb3();
  }

  private async initWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.ethereum !== 'undefined') {
      // Use Mist/MetaMask's provider
      // window.ethereum.enable().then(async () => {
      //   let contractAddress = "0xc814103F21Cc1B1d9F6D32eeb59e30Cb5073FA1F"; //ropsten
      //   alert('Connecting to MetaMask');
      //   this.web3 = new Web3(window.ethereum);
      //   this.contract = new this.web3.eth.Contract(
      //     this.contractABI.abi,
      //     contractAddress
      //   );
      //   this.initEventSubscriptions();
      //   this.isWeb3InvoicesReady.next(true);
      // });
      // Use Mist/MetaMask's provider
      await window.ethereum.enable();
      let contractAddress = "0xc814103F21Cc1B1d9F6D32eeb59e30Cb5073FA1F"; //ropsten
      alert('Connecting to MetaMask');
      this.web3 = new Web3(window.ethereum);
      this.contract = new this.web3.eth.Contract(
        this.contractABI.abi,
        contractAddress
      );
      this.initEventSubscriptions();
      this.isWeb3InvoicesReady.next(true);
    } else {
      // This is the local host case.
      alert('No web3? You should consider trying MetaMask!');

      let contractAddress = "0xc814103F21Cc1B1d9F6D32eeb59e30Cb5073FA1F";
      //let contractAddress = "0x4fa7c2933A553b9346a44ebd9DF6962747a606d4"; //ropsten
      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      //Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      //this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545')); // this allows for the allEvents to work.
      //this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://api.infura.io/v1/jsonrpc/ropsten',options)); // keeping this for future reference.
      //this.web3 = new Web3(new Web3.providers.HttpProvider('https://api.infura.io/v1/jsonrpc/ropsten')); // keeping this for future reference.
      this.contract = new this.web3.eth.Contract(
        //this.contractABI.abi,
        this.contractABI.abi,
        contractAddress
      );
      this.initEventSubscriptions();
      this.isWeb3InvoicesReady.next(true);
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
