import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  addressForm = this.fb.group({
    name: [null, Validators.required],
    address: [null, [Validators.required, Validators.minLength(42), Validators.maxLength(42), this.isNotHex.bind(this)]],
    pwd: [null, [Validators.required, Validators.minLength(8)]]
    //address: [null, [Validators.required, Validators.minLength(42), Validators.maxLength(42)]],
  });

  submitting: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private web3Service: Web3Service) { }

  onSubmit() {
    //let userAddress: string = this.userService.userAddress;
    let address: string = this.addressForm.get('address').value;
    let name: string = this.addressForm.get('name').value;
    let pwd: string = this.addressForm.get('pwd').value;
    let error: boolean = false;
    // if (userAddress === "undefined") {
    //   userAddress = address;
    //   this.userService.userAddress = address;
    // }
    // TODO Deal with existing user.  Query the contract to see if the user exists.
    if (name === "undefined") {
      error = true;
    }
    if (address === "undefined") {
      error = true;
    }
    if (pwd === "undefined") {
      error = true;
    }

    let rString: string = "Thank you."
    if (error === true) {
      rString = "The data you entered is invalid."
      alert(rString);
    } else {
      this.submitting = true;
      this.userService.createUser(address, name, pwd)
        .then(res => {
          this.submitting = false;
          console.log('UserComponent.onSubmit(): res: ', res);
          if (this.userService.success === true) {
            let myData: string = "transactionHash=" + res.transactionHash + " blockHash=" + res.blockHash + " blockNumber=" + res.blockNumber;
            alert('Successfully added ' + name + " " + myData);
          } else {
            alert('Add of ' + name + ' failed');
          }
        })
        .catch(err => {
          this.submitting = false;
          console.log('UserComponent.onSubmit(): err: ', err);
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
