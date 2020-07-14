import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent {
  addressForm = this.fb.group({
    name: [null, Validators.required],
    lastName: [null, Validators.required],
    address: [null, [Validators.required, Validators.minLength(42), Validators.maxLength(42)]],
  });


  constructor(private fb: FormBuilder) { }

  onSubmit() {
    let address: string;
    let name: string;
    let error: boolean = false;
    if( this.addressForm.get('name').value !== '') {
      name = this.addressForm.get('name').value;
    } else {
      error = true;
    }
    if (this.addressForm.get('address').value !== '') {
      address = this.addressForm.get('address').value;
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

  getAddressErrorMessage(): string {
    if (this.addressForm.get('address').hasError('required')) {
      return 'You must enter a 20 byte hex address';
    }
    if (this.addressForm.get('address').hasError('address')) {
      return 'Not a valid 20 byte hex address';
    }
    return '';
  }

}
