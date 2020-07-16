import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface InvoiceListItem {
  inv_id: number;
  net_terms: number;
  hours: number;
  amount: number;
  end_date: string;
  sent_date: string;
  due_30: string;
  due_60: string;
  due_90: string;
  due_120: string;
  pmt_date: string;
}

//displayedColumns = ['inv_id', 'net_terms', 'hours', 'amount', 'end_date', 'sent_date', 'due_30', 'due_60', 'due_90', 'due_120', 'pmt_date'];
// TODO: replace this with real data from your application
const EXAMPLE_DATA: InvoiceListItem[] = [
  {inv_id: 1, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 2, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: 'Thu Dec 10 2020'},
  {inv_id: 3, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 4, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 5, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 6, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 7, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 8, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 9, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 10, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 11, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 12, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 13, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 14, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 15, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 16, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 17, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 18, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 19, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 20, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 21, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 22, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 23, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 24, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 25, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 26, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 27, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 28, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
  {inv_id: 29, net_terms: 30, hours: 80, amount: 8000, end_date: 'Sat Jun 13 2020', sent_date: 'Sat Jun 13 2020', due_30: 'Mon Jul 13 2020', due_60: 'Mon Jul 13 2020', due_90: 'Thu Dec 10 2020', due_120: 'Fri Apr 09 2021', pmt_date: ''},
];

/**
 * Data source for the InvoiceList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class InvoiceListDataSource extends DataSource<InvoiceListItem> {
  data: InvoiceListItem[] = EXAMPLE_DATA;
  paginator: MatPaginator;
  sort: MatSort;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<InvoiceListItem[]> {
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
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: InvoiceListItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: InvoiceListItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'inv_id': return compare(+a.inv_id, +b.inv_id, isAsc);
        case 'net_terms': return compare(a.net_terms, b.net_terms, isAsc);
        case 'hours': return compare(a.hours, b.hours, isAsc);
        case 'amount': return compare(a.amount, b.amount, isAsc);
        case 'end_date': return compare(a.end_date, b.end_date, isAsc);
        case 'sent_date': return compare(a.sent_date, b.sent_date, isAsc);
        case 'due_30': return compare(a.due_30, b.due_30, isAsc);
        case 'due_60': return compare(a.due_60, b.due_60, isAsc);
        case 'due_90': return compare(a.due_90, b.due_90, isAsc);
        case 'due_120': return compare(a.due_120, b.due_120, isAsc);
        case 'pmt_date': return compare(a.pmt_date, b.pmt_date, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
