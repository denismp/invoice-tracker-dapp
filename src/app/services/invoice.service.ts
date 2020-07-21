import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { InvoiceRecordItem } from '../invoice-list/invoice-record-item.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  success: boolean = false;
  constructor(private web3Service: Web3Service) { }

  public async addInvoice(
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
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      let owner: string = this.web3Service.owner;
      this.success = true;
      return await this.web3Service.contract.methods.addInvoice(
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
      ).send({ from: owner, gas:3000000 });
    } catch (err) {
      this.success = false;
      console.log('InvoiceService.addInvoice(): failed:', err);
      alert("InvoiceService.addInvoice(): failed:" + err);
    }
  }

  public async updateInvoice(clientName: string, invoiceNumber: number, datePmtReceived: number): Promise<any> {
    try {
      console.log('clientName=' + clientName);
      console.log('invoiceNumber=' + invoiceNumber);
      console.log('datePmtReceived=' + datePmtReceived);
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      let owner: string = this.web3Service.owner;
      this.success = true;
      return await this.web3Service.contract.methods.updateInvoice(clientName, invoiceNumber, datePmtReceived).send({ from: owner, gas:3000000 });
    } catch (err) {
      this.success = false;
      console.log('InvoiceService.updateInvoice(): failed:', err)
      alert("InvoiceService.updateInvoice(): failed:" + err);
    }
  }

  public async getInvoiceNumbers(clientName: string): Promise<number[]> {
    try {
      console.log('InvoiceService.getInvoiceNumbers(): clientName=' + clientName);
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      let owner: string = this.web3Service.owner;
      const x =  await this.web3Service.contract.methods.getInvoiceNumbers(clientName).call({from: owner, gas:3000000});
      console.log('InvoiceService.getInvoiceNumbers(): DEBUG x=' + x);
      return x;
      //return await this.web3Service.contract.methods.getInvoiceNumbers(clientName).call();
    } catch (err) {
      console.log('InvoiceService.getInvoiceNumbers(): failed:', err)
      alert("InvoiceService.getInvoiceNumbers(): failed:" + err);
    }
  }

  // getInvoice(string memory _clientName, uint256 _invoiceNumber
  public async getInvoice(clientName: string, invoiceNumber: number): Promise<InvoiceRecordItem> {
    try {
      console.log('InvoiceService.getInvoice(): clientName=' + clientName);
      console.log('InvoiceService.getInvoice(): invoiceNumber=' + invoiceNumber);
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      let owner: string = this.web3Service.owner;
      return await this.web3Service.contract.methods.getInvoice(clientName, invoiceNumber).call({from: owner, gas:3000000});
    } catch (err) {
      console.log('InvoiceService.getInvoice(): failed:', err);
      alert("InvoiceService.getInvoice(): failed:" + err);
    }
  }
}
