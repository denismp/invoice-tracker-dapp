import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ClientListDataSource } from './client-list-datasource';
import { ClientService } from '../services/client.service';
import { ClientListItem } from './client-list-item.interface';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ClientListItem>;
  dataSource: ClientListDataSource;
  //public model = new Client();
  // public loadedClients: Client[] = [];
  // public isFetching: boolean = false

  constructor(private clientService: ClientService) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  //displayedColumns = ['id', 'name'];
  displayedColumns = ['clientID', 'name'];

  ngOnInit() {
    this.dataSource = new ClientListDataSource();
    this.loadClients();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  public loadClients(): void {
    // this.loadedClients = [];
    this.clientService.getClientCount()
      .then(count => {
        for (let i = 0; i < count; i++) {
          console.log('ClientListComponent.loadClients(): count=',count);
          this.clientService.getClient(i)
            .then(client => {
              let myClient: ClientListItem = { clientID: client.clientID, name: client.name};
              console.log('ClientListComponent.loadClients(): myClient=',myClient);
              this.dataSource.data.push(myClient);
              console.log('ClientListComponent.loadClient(): data=', this.dataSource.data)
              // this.loadedClients.push(client);
            })
            .catch(err => {
              console.log('ClientListComponent.loadClients(): getClient() failed with err=', err);
            });
        }
        // this.dataSource.data = this.loadedClients;
      })
      .catch(err => {
        console.log('ClientListComponent.loadClients(): getClientCount() failed with err=', err);
      });
  }
}
