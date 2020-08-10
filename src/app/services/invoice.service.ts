import { Injectable } from '@angular/core';
import { InvoiceRecordItem } from '../invoice-list/invoice-record-item.interface';
import { Web3InvoicesService } from './web3-invoices.service';
import { UserService } from './user.service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  success: boolean = false;
  constructor(private userService: UserService, private web3InvoicesService: Web3InvoicesService) { }

  public async addInvoice(
    userAddress: string,
    clientName: string,
    invoiceNumber: number,
    netTerms: number,
    numberHours: number,
    amount: string,
    timesheetEndDate: number,
    invoiceSentDate: number,
    due30DaysDate: number,
    due60DaysDate: number,
    due90DaysDate: number,
    due120DaysDate: number
  ): Promise<any> {
    try {
      //this.initContract(privateKey);
      console.log('clientName=' + clientName);
      console.log('invoiceNumber=' + invoiceNumber);
      console.log('netTerms=' + netTerms);
      console.log('numberHours=' + numberHours);
      console.log('amount=' + amount);
      console.log('timesheetEndDate=' + timesheetEndDate);
      console.log('invoiceSentDate=' + invoiceSentDate);
      console.log('due30DaysDate=' + due30DaysDate);
      console.log('due60DaysDate=' + due60DaysDate);
      console.log('due90DaysDate=' + due90DaysDate);
      console.log('due120DaysDate=' + due120DaysDate);
      //let owner: string = await this.web3InvoicesService.contract.methods.getCurrentOwner().call();
      let owner: string = this.web3InvoicesService.owner;
      this.success = true;
      const pwd = this.userService.pwd;
      // const dates = [];
      // dates[0] = timesheetEndDate;
      // dates[1] = invoiceSentDate;
      // dates[2] = due30DaysDate;
      // dates[3] = due60DaysDate;
      // dates[4] = due90DaysDate;
      // dates[5] = due120DaysDate;
      const invoiceHash = CryptoJS.SHA256(
        "client1" +
        invoiceNumber.toString() +
        "30" +
        "80" +
        "2000.50" +
        timesheetEndDate.toString() +
        invoiceSentDate.toString() +
        due30DaysDate.toString() +
        due60DaysDate.toString() +
        due90DaysDate.toString() +
        due120DaysDate.toString().toString())
      return await this.web3InvoicesService.contract.methods.addInvoice(
        userAddress,
        pwd,
        clientName,
        invoiceHash
        // invoiceNumber,
        // netTerms,
        // numberHours,
        // amount,
        // dates
        // timesheetEndDate,
        // invoiceSentDate,
        // due30DaysDate,
        // due60DaysDate,
        // due90DaysDate,
        // due120DaysDate
      //).send({ from: userAddress, gas:3000000 });
      ).send({ from: userAddress });
    } catch (err) {
      this.success = false;
      console.log('InvoiceService.addInvoice(): failed:', err);
      alert("InvoiceService.addInvoice(): failed:" + err);
    }
  }

  // public async updateInvoice(userAddress: string, clientName: string, invoiceNumber: number, datePmtReceived: number): Promise<any> {
  //   try {
  //     console.log('clientName=' + clientName);
  //     console.log('invoiceNumber=' + invoiceNumber);
  //     console.log('datePmtReceived=' + datePmtReceived);
  //     //let owner: string = await this.web3InvoicesService.contract.methods.getCurrentOwner().call();
  //     let owner: string = this.web3InvoicesService.owner;
  //     this.success = true;
  //     //return await this.web3InvoicesService.contract.methods.updateInvoice(userAddress, clientName, invoiceNumber, datePmtReceived).send({ from: userAddress, gas:3000000 });
  //     return await this.web3InvoicesService.contract.methods.updateInvoice(userAddress, clientName, invoiceNumber, datePmtReceived).send({ from: userAddress });
  //   } catch (err) {
  //     this.success = false;
  //     console.log('InvoiceService.updateInvoice(): failed:', err)
  //     alert("InvoiceService.updateInvoice(): failed:" + err);
  //   }
  // }

  // public async getInvoiceNumbers(userAddress: string, clientName: string): Promise<number[]> {
  //   try {
  //     console.log('InvoiceService.getInvoiceNumbers(): clientName=' + clientName);
  //     //let owner: string = await this.web3InvoicesService.contract.methods.getCurrentOwner().call();
  //     let owner: string = this.web3InvoicesService.owner;
  //     //const x =  await this.web3InvoicesService.contract.methods.getInvoiceNumbers(userAddress, clientName).call({from: userAddress, gas:3000000});
  //     const invoiceNumbers =  await this.web3InvoicesService.contract.methods.getInvoiceNumbers(userAddress, clientName).call({from: userAddress});
  //     console.log('InvoiceService.getInvoiceNumbers(): DEBUG x=' + invoiceNumbers);
  //     return invoiceNumbers;
  //     //return await this.web3InvoicesService.contract.methods.getInvoiceNumbers(clientName).call();
  //   } catch (err) {
  //     console.log('InvoiceService.getInvoiceNumbers(): failed:', err)
  //     alert("InvoiceService.getInvoiceNumbers(): failed:" + err);
  //   }
  // }
  public async getInvoiceCount(userAddress: string, clientName: string): Promise<number[]> {
    try {
      console.log('InvoiceService.getInvoiceCount(): clientName=' + clientName);
      //let owner: string = await this.web3InvoicesService.contract.methods.getCurrentOwner().call();
      const owner: string = this.web3InvoicesService.owner;
      const pwd = this.userService.pwd;
      //const x =  await this.web3InvoicesService.contract.methods.getInvoiceNumbers(userAddress, clientName).call({from: userAddress, gas:3000000});
      const invoiceCount =  await this.web3InvoicesService.contract.methods.getInvoiceCount(userAddress, pwd, clientName).call({from: userAddress});
      console.log('InvoiceService.getInvoiceCount(): DEBUG invoiceCount=' + invoiceCount);
      return invoiceCount;
    } catch (err) {
      console.log('InvoiceService.getInvoiceCount(): failed:', err)
      alert("InvoiceService.getInvoiceCount(): failed:" + err);
    }
  }

  // getInvoice(string memory _clientName, uint256 _invoiceNumber
  public async getInvoice(userAddress: string, clientName: string, invoiceIndex: number): Promise<InvoiceRecordItem> {
    try {
      console.log('InvoiceService.getInvoice(): clientName=' + clientName);
      console.log('InvoiceService.getInvoice(): invoiceNumber=' + invoiceIndex);
      //let owner: string = await this.web3InvoicesService.contract.methods.getCurrentOwner().call();
      const owner: string = this.web3InvoicesService.owner;
      const pwd = this.userService.pwd;
      return await this.web3InvoicesService.contract.methods.getInvoice(userAddress, clientName, invoiceIndex).call({from: userAddress});
    } catch (err) {
      console.log('InvoiceService.getInvoice(): failed:', err);
      alert("InvoiceService.getInvoice(): failed:" + err);
    }
  }
}
