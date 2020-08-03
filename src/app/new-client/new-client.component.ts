import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClientService } from '../services/client.service';
import { Web3Service } from '../services/web3.service';
import { UserService } from '../services/user.service';

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

  submitting: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private clientService: ClientService, private web3Service: Web3Service) { }

  onSubmit() {
    const userAddress: string = this.userService.userAddress;
    let address: string = this.addressForm.get('address').value;
    let name: string = this.addressForm.get('name').value;
    let error: boolean = false;
    let rString: string = "";
    if (name === "undefined") {
      error = true;
      rString = "Please enter a client name."
    }
    if (address === "undefined" || address.length !== 42) {
      error = true;
      rString = "Please enter an wallet account address of length 42 starting with '0x'."
    }

    if (error === true) {
      //rString = "The data you entered is invalid."
      alert(rString);
    } else {
      this.submitting = true;
      this.clientService.createClient(userAddress, address, name)
        .then(res => {
          this.submitting = false;
          console.log('NewClientComponent.onSubmit(): res: ', res);
          if (this.clientService.success === true) {
            let myData: string = "transactionHash=" + res.transactionHash + " blockHash=" + res.blockHash + " blockNumber=" + res.blockNumber;
            alert('Successfully added ' + name + " " + myData);
          } else {
            alert('Add of ' + name + ' failed');
          }
        })
        .catch(err => {
          this.submitting = false;
          console.log('NewClientComponent.onSubmit(): err: ', err);
          alert('Submit failed.');
        });
    }
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
