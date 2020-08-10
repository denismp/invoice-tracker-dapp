import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { InvoiceListDataSource } from './invoice-list-datasource';
import { InvoiceService } from '../services/invoice.service';
import { InvoiceListItem } from './invoice-list-item.interface';
import { InvoiceRecordItem } from './invoice-record-item.interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<InvoiceRecordItem>;
  dataSource: InvoiceListDataSource;

  submitted: boolean = false;
  isFetching: boolean = false;
  clientName: string;

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

  constructor(private userService: UserService, private invoiceService: InvoiceService) { }

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
    this.dataSource.data = [];
  }

  nameEventHandler($event: any) {
    const userAddress: string = this.userService.userAddress;
    console.log('InvoiceListComponent.nameEventHandler(): called...');
    this.submitted = true;
    this.clientName = $event;
    console.log('InvoiceListComponent.nameEventHandler(): clientName=', this.clientName);
    this.submitted = true;
    // Here we need to call the solidity contract to get the list of invoice numbers and then retrieve the invoices one at a time.
    this.isFetching = true;
    // this.invoiceService.getInvoiceNumbers(userAddress, this.clientName)
    //   .then(res => {
    //     this.isFetching = false;
    //     if (res !== undefined) {
    //       console.log('InvoiceListComponent.nameEventHandler(): SUCCESS: ', res);
    //       let _invNums: number[] = res;
    //       //this.invoiceNumbers = res;
    //       const clientName: string = this.clientName;
    //       // extract the numbers into an array.
    //       //const nList: string[] = _invNums.split(",");
    //       for (let i = 0; i < _invNums.length; i++) {
    //         //console.log('nList[' + i + ']=' + nList[i]);
    //         let _invNum: number = _invNums[i];
    //         this.invoiceService.getInvoice(userAddress, clientName, _invNum)
    //           .then(invoice => {
    //             console.log('InvoiceListComponent.nameEventHandler(): invoice: ', invoice);
    //             invoice.clientName = this.clientName;
    //             invoice.invoiceNumber = invoice.invoiceNumber;
    //             invoice.netTerms = invoice.netTerms;
    //             invoice.numberHours = invoice.numberHours;
    //             invoice.amount = invoice.amount;
    //             invoice.timesheetEndDate = this.getStdDateString(invoice.timesheetEndDate.toString());
    //             invoice.invoiceSentDate = this.getStdDateString(invoice.invoiceSentDate.toString());
    //             invoice.due30DaysDate = this.getStdDateString(invoice.due30DaysDate.toString());
    //             invoice.due60DaysDate = this.getStdDateString(invoice.due60DaysDate.toString());
    //             invoice.due90DaysDate = this.getStdDateString(invoice.due90DaysDate.toString());
    //             invoice.due120DaysDate = this.getStdDateString(invoice.due120DaysDate.toString());
    //             invoice.datePmtReceived = this.getStdDateString(invoice.datePmtReceived.toString())
    //             console.log('InvoiceListComponent.nameEventHandler(): invoice=', invoice);
    //             // console.log('Invoice[' + i + ']datePmtReceived=' + invoice.datePmtReceived);
    //             // console.log('Invoice[' + i + ']due120DaysDate=' + invoice.due120DaysDate);
    //             // console.log('Invoice[' + i + ']due30DaysDate=' + invoice.due30DaysDate);
    //             // console.log('Invoice[' + i + ']due60DaysDate=' + invoice.due60DaysDate);

    //             //this.loadedInvoices.push(invoice);
    //             invoice.clientName = this.clientName;
    //             this.dataSource.addData(invoice);
    //             this.dataSource.sort.sortChange.next();
    //           })
    //           .catch(err => {
    //             console.log('InvoiceListComponent.nameEventHandler(): err: ', err);
    //           });
    //     }
    //   } else {
    //     console.log('InvoiceListComponent.nameEventHandler(): getInvoiceNumbers() returned no data');
    //   }
    // })
    // .catch(err => {
    //   this.isFetching = false;
    //   console.log(err);
    // });
  }

  public getStdDateString(_numSeconds: string): string {
    //console.log('getStdDateString(): _numSeconds=',_numSeconds);
    if (parseInt(_numSeconds) === 0) {
      return "";
    }
    let rVal: string = new Date(parseInt(_numSeconds) * 1000).toDateString();
    return rVal;
  }

}
