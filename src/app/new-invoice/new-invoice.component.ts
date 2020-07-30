import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';
import { InvoiceService } from '../services/invoice.service';
import { Web3Service } from '../services/web3.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss']
})
export class NewInvoiceComponent {
  addressForm = this.fb.group({
    name: [null, Validators.required],
    invoicenumber: [null, [Validators.required, this.isNotNumber.bind(this)]],
    netterms: [null, [Validators.required, this.isNotNumber.bind(this)]],
    numberofhours: [null, [Validators.required, this.isNotNumber.bind(this)]],
    amountofinvoice: [null, [Validators.required, this.isNotNumber.bind(this)]],
    timesheetendingdate: [null, [Validators.required]],
    timesheetsentdate: [null, [Validators.required]],
  });
  submitting: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private invoiceService: InvoiceService, private web3Service: Web3Service) { }

  onSubmit() {
    let error: boolean = false;
    let rString: string = "Thank you."
    let name: string = this.addressForm.get('name').value;
    let invoicenumber: string = this.addressForm.get('invoicenumber').value;
    let netterms: string = this.addressForm.get('netterms').value;
    let numberofhours: string = this.addressForm.get('numberofhours').value;
    let amountofinvoice: string = this.addressForm.get('amountofinvoice').value;
    let timesheetendingdate: string = this.addressForm.get('timesheetendingdate').value;
    let timesheetsentdate: string = this.addressForm.get('timesheetsentdate').value;
    const userAddres: string = this.userService.userAddress;

    if (name === null) {
      error = true;
    }
    if (invoicenumber === null) {
      error = true;
    }
    if (netterms === null) {
      error = true;
    }
    if (numberofhours === null) {
      error = true;
    }
    if (amountofinvoice === null) {
      error = true;
    }
    if (timesheetendingdate === null) {
      error = true;
    }
    if (timesheetsentdate === null) {
      error = true;
    }
    if (error === true) {
      rString = "The data you entered is invalid."
      alert(rString);
    }

    if (error === true) {
      this.submitting = false;
      // this.clientService.createClient()
    } else {
      this.submitting = true;
      console.log('NewInvoiceComponent.onSubmit(): timesheetsentdate=', timesheetsentdate);
      console.log('NewInvoiceComponent.onSubmit(): conversions of timesheetsentdate in millseconds=', Date.parse(timesheetsentdate));
      console.log('NewInvoiceComponent.onSubmit(): conversions of timesheetsentdate in seconds(Unix Epoch)=', Math.round(Date.parse(timesheetsentdate)/1000));
      this.invoiceService.addInvoice(
        userAddres,
        name,
        parseInt(invoicenumber),
        parseInt(netterms),
        parseInt(numberofhours),
        amountofinvoice,
        Math.round(Date.parse(timesheetendingdate)/1000),
        Math.round(Date.parse(timesheetsentdate)/1000),
        this.getDateDays(Date.parse(timesheetsentdate), 30),
        this.getDateDays(Date.parse(timesheetsentdate), 60),
        this.getDateDays(Date.parse(timesheetsentdate), 90),
        this.getDateDays(Date.parse(timesheetsentdate), 120)
        )
        .then(res => {
          this.submitting = false;
          console.log('NewInvoiceComponent.onSubmit(): res=', res);
          if (this.invoiceService.success === true) {
            let myData: string = "transactionHash=" + res.transactionHash + " blockHash=" + res.blockHash + " blockNumber=" + res.blockNumber;
            alert('Successfully added ' + name + " " + myData);
          } else {
            alert('Add of ' + name + ' failed');
          }
        })
        .catch(err => {
          this.submitting = false;
          console.log('NewInvoiceComponent.onSubmit(): err: ', err);
          alert('Submit failed.');
        });
    }

  }

  private getDateDays( invoiceSentTime: number, numDays: number): number {
    const ldate: Date = new Date(Math.round(invoiceSentTime/1000)); // convert to the Unix Epoch in seconds for the solidity contract.
    let rval = ldate.setDate(ldate.getDate() + numDays);
    return rval;
  }

  /**
   * check that the control is not a number
   * @param control
   * @returns true or null
   */
  isNotNumber(control: FormControl): { [s: string]: boolean } {
    if (isNaN(control.value)) {
      return { 'isNotNumber': true };
    }
    return null;
  }

  getInvoiceNumberErrorMessage(): string {
    //console.log('getInvoiceNumberErrorMessage(): called...');
    if (this.addressForm.get('invoicenumber').hasError('required')) {
      //console.log('getInvoiceNumberErrorMessage(): DEBUG1');
      return 'No value.  You must enter an invoice number';
    }
    if (this.addressForm.get('invoicenumber').hasError('isNotNumber')) {
      //console.log('getInvoiceNumberErrorMessage(): DEBUG2');
      return 'Invalid numeric value. You must enter a number';
    }
    return '';
  }

  getNetTermsErrorMessage(): string {
    //console.log('getNetTermsErrorMessage(): called...');
    if (this.addressForm.get('netterms').hasError('required')) {
      //console.log('getNetTermsErrorMessage(): DEBUG1');
      return 'No value.  You must enter net terms';
    }
    if (this.addressForm.get('netterms').hasError('isNotNumber')) {
      //console.log('getNetTermsErrorMessage(): DEBUG2');
      return 'Invalid numeric value. You must enter a number';
    }
    return '';
  }

  getNumberOfHoursErrorMessage(): string {
    //console.log('getNumberOfHoursErrorMessage(): called...');
    if (this.addressForm.get('numberofhours').hasError('required')) {
      //console.log('getNumberOfHoursErrorMessage(): DEBUG1');
      return 'No value.  You must enter number of hours';
    }
    if (this.addressForm.get('numberofhours').hasError('isNotNumber')) {
      //console.log('getNumberOfHoursErrorMessage(): DEBUG2');
      return 'Invalid numeric value. You must enter a number';
    }
    return '';
  }

  getAmountOfInvoiceErrorMessage(): string {
    //console.log('getAmountOfInvoiceErrorMessage(): called...');
    if (this.addressForm.get('amountofinvoice').hasError('required')) {
      //console.log('getAmountOfInvoiceErrorMessage(): DEBUG1');
      return 'No value.  You must enter the amount of the invoice';
    }
    if (this.addressForm.get('amountofinvoice').hasError('isNotNumber')) {
      //console.log('getAmountOfInvoiceErrorMessage(): DEBUG2');
      return 'Invalid numeric value. You must enter a number';
    }
    return '';
  }
}
