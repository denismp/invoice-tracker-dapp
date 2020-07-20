import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { InvoiceListDataSource } from './invoice-list-datasource';
import { InvoiceService } from '../services/invoice.service';
import { InvoiceListItem } from './invoice-list-item.interface';

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

  // clientName: string;
  // invoiceNumber: number;
  // netTerms: number;
  // numberHours: number;
  // amount: string;
  // timesheetEndDate: number;
  // rTimesheetEndDate: Date;
  // sTimesheetEndDate: string;
  // invoiceSentDate: number;
  // due30DaysDate: number;
  // due60DaysDate: number;
  // due90DaysDate: number;
  // due120DaysDate: number;
  // datePmtReceived: number;
  // rDatePmtReceived: Date;
  // sDatePmtReceived: string
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'clientName',
    'invoiceNumber',
    'netTerms',
    'numberHours',
    'amount',
    'timesheetEndDate',
    'invoiceSentDate',
    'due30DaysDate',
    'due60DaysDate',
    'due90DaysDate',
    'due120DaysDate',
    'datePmtReceived'
  ];

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
    console.log('InvoiceListComponent.nameEventHandler(): called...');
    this.submitted = true;
    this.clientName = $event;
    console.log('InvoiceListComponent.nameEventHandler(): clientName=',this.clientName);
    this.submitted = true;
    // Here we need to call the solidity contract to get the list of invoice numbers and then retrieve the invoices one at a time.
    this.isFetching = true;
    this.invoiceService.getInvoiceNumbers(this.clientName)
      .then(res => {
        this.isFetching = false;
        if (res !== undefined) {
          console.log('InvoiceListComponent.nameEventHandler(): SUCCESS: ', res);
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
                console.log('InvoiceListComponent.nameEventHandler(): invoice: ', invoice);
                let myInvoice: InvoiceListItem = {
                  clientName: this.clientName,
                  invoiceNumber: invoice.invoiceNumber,
                  netTerms: invoice.netTerms,
                  numberHours: invoice.numberHours,
                  amount: invoice.amount,
                  timesheetEndDate: invoice.timesheetEndDate,
                  rTimesheetEndDate: null,
                  sTimesheetEndDate: '',
                  invoiceSentDate: invoice.invoiceSentDate,
                  due30DaysDate: invoice.due30DaysDate,
                  due60DaysDate: invoice.due60DaysDate,
                  due90DaysDate: invoice.due90DaysDate,
                  due120DaysDate: invoice.due120DaysDate,
                  datePmtReceived: invoice.datePmtReceived,
                  rDatePmtReceived: null,
                  sDatePmtReceived: ''
                };
                console.log('InvoiceListComponent.nameEventHandler(): myInvoice=', myInvoice);
                // console.log('Invoice[' + i + ']datePmtReceived=' + invoice.datePmtReceived);
                // console.log('Invoice[' + i + ']due120DaysDate=' + invoice.due120DaysDate);
                // console.log('Invoice[' + i + ']due30DaysDate=' + invoice.due30DaysDate);
                // console.log('Invoice[' + i + ']due60DaysDate=' + invoice.due60DaysDate);

                //this.loadedInvoices.push(invoice);
                invoice.clientName = this.clientName;
                this.dataSource.addData(invoice);
                this.dataSource.sort.sortChange.next();
              })
              .catch(err => {
                console.log('InvoiceListComponent.nameEventHandler(): err: ', err);
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
