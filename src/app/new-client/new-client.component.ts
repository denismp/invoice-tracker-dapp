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
    address: [null, Validators.required],
  });


  constructor(private fb: FormBuilder) {}

  onSubmit() {
    alert('Thanks!');
  }
}
