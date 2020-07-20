import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, retry } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';
import { InvoiceRecordItem } from './invoice-record-item.interface';

// TODO: Replace this with your own data model type
// export interface InvoiceRecordItem {
//   inv_id: number;
//   net_terms: number;
//   hours: number;
//   amount: number;
//   end_date: string;
//   sent_date: string;
//   due_30: string;
//   due_60: string;
//   due_90: string;
//   due_120: string;
//   pmt_date: string;
// }

// // TODO: replace this with real data from your application
// const EXAMPLE_DATA: InvoiceRecordItem[] = [
//   {inv_id: 1, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 2, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: 'Thu Dec 10 2020'},
//   {inv_id: 3, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 4, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 5, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 6, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 7, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 8, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 9, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 10, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 11, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 12, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 13, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 14, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 15, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 16, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 17, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 18, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 19, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 20, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 21, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 22, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 23, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 24, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 25, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 26, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 27, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 28, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
//   {inv_id: 29, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
// ];

/**
 * Data source for the InvoiceList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class InvoiceListDataSource extends DataSource<InvoiceRecordItem> {
  //data: InvoiceRecordItem[] = EXAMPLE_DATA;
  dataStream = new BehaviorSubject<InvoiceRecordItem[]>([]);

  set data(v: InvoiceRecordItem[]) { this.dataStream.next(v); }
  get data(): InvoiceRecordItem[] { return this.dataStream.value; }

  paginator: MatPaginator;
  sort: MatSort;

  constructor() {
    super();
  }

  addData(record: InvoiceRecordItem) {
    const copiedData = this.data.slice();
    copiedData.push(record);
    this.data = copiedData;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<InvoiceRecordItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: InvoiceRecordItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: InvoiceRecordItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'clientName': return compare(+a.clientName, +b.clientName, isAsc);
        case 'invoiceNumber': return compare(+a.invoiceNumber, +b.invoiceNumber, isAsc);
        case 'netTerms': return compare(a.netTerms, b.netTerms, isAsc);
        case 'numberHours': return compare(a.numberHours, b.numberHours, isAsc);
        case 'amount': return compare(a.amount, b.amount, isAsc);
        case 'timesheetEndDate': return compare(a.timesheetEndDate, b.timesheetEndDate, isAsc);
        case 'invoiceSendDate': return compare(a.invoiceSentDate, b.invoiceSentDate, isAsc);
        case 'due30DaysDate': return compare(a.due30DaysDate, b.due30DaysDate, isAsc);
        case 'due60DaysDate': return compare(a.due60DaysDate, b.due60DaysDate, isAsc);
        case 'due90DaysDate': return compare(a.due90DaysDate, b.due90DaysDate, isAsc);
        case 'due120DaysDate': return compare(a.due90DaysDate, b.due90DaysDate, isAsc);
        case 'datePmtReceived': return compare(a.datePmtReceived, b.datePmtReceived, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
