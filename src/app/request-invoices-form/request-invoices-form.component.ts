import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-request-invoices-form',
  templateUrl: './request-invoices-form.component.html',
  styleUrls: ['./request-invoices-form.component.scss']
})
export class RequestInvoicesFormComponent {
  addressForm = this.fb.group({
    name: [null, Validators.required],
  });
  clientName: string;

  @Output() nameEvent = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    // alert('Thanks!');
    this.nameEvent.emit(this.addressForm.get('name').value);
  }
}
