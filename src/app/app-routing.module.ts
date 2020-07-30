import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewClientComponent } from './new-client/new-client.component';
import { ClientListComponent } from './client-list/client-list.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { UpdateInvoiceComponent } from './update-invoice/update-invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'new-client', component: NewClientComponent },
  { path: 'client-list', component: ClientListComponent },
  { path: 'new-invoice', component: NewInvoiceComponent },
  { path: 'update-invoice', component: UpdateInvoiceComponent },
  { path: 'invoice-list', component: InvoiceListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
