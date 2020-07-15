import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }

  onSubmit() {
    let error: boolean = false;
    let res: string = "Thank you."
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
      res = "The data you entered is invalid."
    }
    alert(res);
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

