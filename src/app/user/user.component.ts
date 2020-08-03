import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Web3Service } from '../services/web3.service';
import { User } from './user.interface';

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

  constructor(private fb: FormBuilder, private userService: UserService) { }

  async onSubmit() {
    //let userAddress: string = this.userService.userAddress;
    let readSuccess: boolean = false;
    let address: string = this.addressForm.get('address').value;
    let name: string = this.addressForm.get('name').value;
    let pwd: string = this.addressForm.get('pwd').value;
    let error: boolean = false;
    let rString: string = "";
    if (name === "undefined") {
      error = true;
      rString = "Please enter a user name."
    }
    if (address === "undefined" || address.length !== 42) {
      error = true;
      rString = "Please enter an wallet account address of length 42 starting with '0x'."
    }
    if (pwd === "undefined" || pwd.length < 8) {
      error = true;
      rString = "Please enter a password of 8 characters."
    }

    if (error === true) {
      alert(rString);
    } else {
      // Query the contract for the user to see if this is a login or a new user.
      const user: User = await this.userService.getUser(address);
      if (user === null) {
        readSuccess = false;
        this.userService.pwd = '';
      } else {
        if (await this.isValidPassword(user.ePwd, pwd) === false) {
          readSuccess = false;
          error = true;
          this.userService.pwd = '';
          alert('You entered an invalid password')
        } else {
          readSuccess = true;
          this.userService.userAddress = address;
          this.userService.pwd = pwd;
          console.log('UserComponent.onSubmit().getUser(): ' + address + ' is an existing user.');
        }
      }
      if (readSuccess === false && error === false) {
        this.submitting = true;
        this.userService.createUser(address, name, pwd)
          .then(res => {
            this.submitting = false;
            console.log('UserComponent.onSubmit().createUser(): res: ', res);
            if (this.userService.success === true) {
              this.userService.pwd = pwd;
              let myData: string = "transactionHash=" + res.transactionHash + " blockHash=" + res.blockHash + " blockNumber=" + res.blockNumber;
              alert('Successfully added ' + name + " " + myData);
            } else {
              alert('Add of ' + name + ' failed');
            }
          })
          .catch(err => {
            this.userService.pwd = '';
            this.submitting = false;
            console.log('UserComponent.onSubmit(): err: ', err);
            alert('Submit failed.');
          });
      }
    }
  }

  private async isValidPassword(epwd: string, pwd: string): Promise<boolean> {
    console.log('UserComponent.isValidPassword(): epwd=', epwd);
    console.log('UserComponent.isValidPassword(): pwd=', pwd);
    const encryptedPwd: string = await this.userService.calcPassword(pwd);
    console.log('UserComponent.isValidPassword().calPassword(): encryptedPwd=', encryptedPwd);
    if (epwd === encryptedPwd) {
      return true;
    } else {
      return false;
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
