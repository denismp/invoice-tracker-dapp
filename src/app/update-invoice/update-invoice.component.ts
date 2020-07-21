import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-update-invoice',
  templateUrl: './update-invoice.component.html',
  styleUrls: ['./update-invoice.component.scss']
})
export class UpdateInvoiceComponent {

  addressForm = this.fb.group({
    name: [null, Validators.required],
    invoicenumber: [null, [Validators.required, this.isNotNumber.bind(this)]],
    paymentreceiveddate: [null, [Validators.required]],
  });

  submitting: boolean = false;

  constructor(private fb: FormBuilder, private invoiceService: InvoiceService) { }

  onSubmit() {
    let error: boolean = false;
    let rString: string = "Thank you."
    let name: string = this.addressForm.get('name').value;
    let invoicenumber: string = this.addressForm.get('invoicenumber').value;
    let paymentreceiveddate: string = this.addressForm.get('paymentreceiveddate').value;

    if (name === null) {
      error = true;
    }
    if (invoicenumber === null) {
      error = true;
    }
    if (paymentreceiveddate === null) {
      error = true;
    }
    if (error === true) {
      rString = "The data you entered is invalid."
      alert(rString);
    } else {
      this.submitting = true;
      console.log('UpdateInvoiceComponent.onSubmit(): paymentreceiveddate=', paymentreceiveddate);
      console.log('UpdateInvoiceComponent.onSubmit(): conversions of paymentreceiveddate in millseconds=', Date.parse(paymentreceiveddate));
      console.log('UpdateInvoiceComponent.onSubmit(): conversions of paymentreceiveddate in seconds(Unix Epoch)=', Math.round(Date.parse(paymentreceiveddate)/1000));
      this.invoiceService.updateInvoice(
        name,
        parseInt(invoicenumber),
        Math.round(Date.parse(paymentreceiveddate)/1000)
        )
        .then(res => {
          this.submitting = false;
          console.log('UpdateInvoiceComponent.onSubmit(): res=', res);
          if (this.invoiceService.success === true) {
            let myData: string = "transactionHash=" + res.transactionHash + " blockHash=" + res.blockHash + " blockNumber=" + res.blockNumber;
            alert('Successfully added ' + name + " " + myData);
          } else {
            alert('Add of ' + name + ' failed');
          }
        })
        .catch(err => {
          this.submitting = false;
          console.log('UpdateInvoiceComponent.onSubmit(): err: ', err);
          alert('Submit failed.');
        });
      }
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
}

