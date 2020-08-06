import { Injectable } from '@angular/core';
import { InvoiceRecordItem } from '../invoice-list/invoice-record-item.interface';
import { Web3InvoicesService } from './web3-invoices.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  success: boolean = false;
  constructor(private web3InvoicesService: Web3InvoicesService) { }

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
      return await this.web3InvoicesService.contract.methods.addInvoice(
        userAddress,
        clientName,
        invoiceNumber,
        netTerms,
        numberHours,
        amount,
        timesheetEndDate,
        invoiceSentDate,
        due30DaysDate,
        due60DaysDate,
        due90DaysDate,
        due120DaysDate
      ).send({ from: userAddress, gas:3000000 });
    } catch (err) {
      this.success = false;
      console.log('InvoiceService.addInvoice(): failed:', err);
      alert("InvoiceService.addInvoice(): failed:" + err);
    }
  }

  public async updateInvoice(userAddress: string, clientName: string, invoiceNumber: number, datePmtReceived: number): Promise<any> {
    try {
      console.log('clientName=' + clientName);
      console.log('invoiceNumber=' + invoiceNumber);
      console.log('datePmtReceived=' + datePmtReceived);
      //let owner: string = await this.web3InvoicesService.contract.methods.getCurrentOwner().call();
      let owner: string = this.web3InvoicesService.owner;
      this.success = true;
      return await this.web3InvoicesService.contract.methods.updateInvoice(userAddress, clientName, invoiceNumber, datePmtReceived).send({ from: userAddress, gas:3000000 });
    } catch (err) {
      this.success = false;
      console.log('InvoiceService.updateInvoice(): failed:', err)
      alert("InvoiceService.updateInvoice(): failed:" + err);
    }
  }

  public async getInvoiceNumbers(userAddress: string, clientName: string): Promise<number[]> {
    try {
      console.log('InvoiceService.getInvoiceNumbers(): clientName=' + clientName);
      //let owner: string = await this.web3InvoicesService.contract.methods.getCurrentOwner().call();
      let owner: string = this.web3InvoicesService.owner;
      const x =  await this.web3InvoicesService.contract.methods.getInvoiceNumbers(userAddress, clientName).call({from: userAddress, gas:3000000});
      console.log('InvoiceService.getInvoiceNumbers(): DEBUG x=' + x);
      return x;
      //return await this.web3InvoicesService.contract.methods.getInvoiceNumbers(clientName).call();
    } catch (err) {
      console.log('InvoiceService.getInvoiceNumbers(): failed:', err)
      alert("InvoiceService.getInvoiceNumbers(): failed:" + err);
    }
  }

  // getInvoice(string memory _clientName, uint256 _invoiceNumber
  public async getInvoice(userAddress: string, clientName: string, invoiceNumber: number): Promise<InvoiceRecordItem> {
    try {
      console.log('InvoiceService.getInvoice(): clientName=' + clientName);
      console.log('InvoiceService.getInvoice(): invoiceNumber=' + invoiceNumber);
      //let owner: string = await this.web3InvoicesService.contract.methods.getCurrentOwner().call();
      let owner: string = this.web3InvoicesService.owner;
      return await this.web3InvoicesService.contract.methods.getInvoice(userAddress, clientName, invoiceNumber).call({from: owner, gas:3000000});
    } catch (err) {
      console.log('InvoiceService.getInvoice(): failed:', err);
      alert("InvoiceService.getInvoice(): failed:" + err);
    }
  }
}
