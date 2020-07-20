import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-query-request-form',
  templateUrl: './query-request-form.component.html',
  styleUrls: ['./query-request-form.component.scss']
})
export class QueryRequestFormComponent {
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
