import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent {
  addressForm = this.fb.group({
    name: [null, Validators.required],
    address: [null, [Validators.required, Validators.minLength(42), Validators.maxLength(42), this.isNotHex.bind(this)]]
    //address: [null, [Validators.required, Validators.minLength(42), Validators.maxLength(42)]],
  });


  constructor(private fb: FormBuilder) { }

  onSubmit() {
    let address: string;
    let name: string;
    let error: boolean = false;
    if (this.addressForm.get('name').value !== '') {
      name = this.addressForm.get('name').value;
    } else {
      error = true;
    }
    if (this.addressForm.get('address').value !== '') {
      address = this.addressForm.get('address').value;
      if (this.isValidHexString(address) === false ) {
        error = true;
      }
    } else {
      error = true;
    }

    address = this.addressForm.get('address').value;
    console.log('length=' + address.length);
    let res: string = "Thank you."
    if (error === true) {
      res = "The data you entered is invalid."
    }
    alert(res);
  }

  isValidHexString(str: string): boolean {
    if (str === null) {
      return false;
    }
    let rVal: boolean = true;
    const upperStr: string = str.toUpperCase();
    const hexDidgits: string = "XABCDEF0123456789"; // deals with leading 0x
    for (let i = 0; i < upperStr.length; i++) {
      let found = false;
      for (let j = 0; j < hexDidgits.length; j++) {
        if (upperStr.charAt(i) === hexDidgits.charAt(j)) {
          found = true;
          break;
        }
      }
      if (found === false) {
        rVal = false;
        break;
      }
    }
    console.log("isValidHexString()=", rVal);
    return rVal;
  }

  isNotHex(control: FormControl): { [s: string]: boolean } {
    if (this.isValidHexString(control.value) !== true) {
      return { 'notHex': true };
    }
    return null;
  }

  getAddressErrorMessage(): string {
    console.log('getAddressErrorMessage(): called...');
    if (this.addressForm.get('address').hasError('required')) {
      console.log('getAddressErrorMessage(): DEBUG1');
      return 'No value.  You must enter a 42 byte hex address starting with 0x';
    }
    if (this.addressForm.get('address').hasError('notHex')) {
      console.log('getAddressErrorMessage(): DEBUG2');
      return 'Invalid hex value. You must enter a 42 byte hex address starting with 0x';
    }
    if (this.addressForm.get('address').invalid) {
      console.log('getAddressErrorMessage(): DEBUG3');
      return 'Incorrect address length.  You must enter a 42 byte hex address starting with 0x';
    }
    return '';
  }

}
