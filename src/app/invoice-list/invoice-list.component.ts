import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { InvoiceListDataSource, InvoiceListItem } from './invoice-list-datasource';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<InvoiceListItem>;
  dataSource: InvoiceListDataSource;

  submitted: boolean = false;
  isFetching: boolean = false;
  clientName: string;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['inv_id', 'net_terms', 'hours', 'amount', 'end_date', 'sent_date', 'due_30', 'due_60', 'due_90', 'due_120', 'pmt_date'];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.dataSource = new InvoiceListDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  public newInvoice() {
    this.submitted = false;
    // this.model = new Invoice();
    // this.loadedInvoices = [];
  }

  nameEventHandler($event: any) {
    this.submitted = true;
    this.clientName = $event;
    console.log(this.clientName);
    this.submitted = true;
    // Here we need to call the solidity contract to get the list of invoice numbers and then retrieve the invoices one at a time.
    this.isFetching = true;
    this.invoiceService.getInvoiceNumbers(this.clientName)
      .then(res => {
        this.isFetching = false;
        if (res !== undefined) {
          console.log('SUCCESS: ', res);
          let _invNums: number[] = res;
          //this.invoiceNumbers = res;
          const clientName: string = this.clientName;
          // extract the numbers into an array.
          //const nList: string[] = _invNums.split(",");
          for (let i = 0; i < _invNums.length; i++) {
            //console.log('nList[' + i + ']=' + nList[i]);
            let _invNum: number = _invNums[i];
            this.invoiceService.getInvoice(clientName, _invNum)
              .then(invoice => {
                console.log(invoice);
                // console.log('Invoice[' + i + ']datePmtReceived=' + invoice.datePmtReceived);
                // console.log('Invoice[' + i + ']due120DaysDate=' + invoice.due120DaysDate);
                // console.log('Invoice[' + i + ']due30DaysDate=' + invoice.due30DaysDate);
                // console.log('Invoice[' + i + ']due60DaysDate=' + invoice.due60DaysDate);

                //this.loadedInvoices.push(invoice);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          console.log('InvoiceListComponent.nameEventHandler(): getInvoiceNumbers() returned no data');
        }
      })
      .catch(err => {
        this.isFetching = false;
        console.log(err);
      });
  }

}
