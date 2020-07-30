import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ClientListDataSource } from './client-list-datasource';
import { ClientService } from '../services/client.service';
import { ClientListItem } from './client-list-item.interface';
import { UserService } from '../services/user.service';

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
  userAddress: string;

  //public model = new Client();
  // public loadedClients: Client[] = [];
  // public isFetching: boolean = false

  constructor(private userService: UserService, private clientService: ClientService) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  //displayedColumns = ['id', 'name'];
  displayedColumns = ['clientID', 'name'];

  ngOnInit() {
    this.dataSource = new ClientListDataSource();
    this.userAddress = this.userService.userAddress;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.loadClients(this.userAddress);
  }

  public loadClients(userAddress: string): void {
    // this.loadedClients = [];
    this.clientService.getClientCount(userAddress)
      .then(count => {
        for (let i = 0; i < count; i++) {
          console.log('ClientListComponent.loadClients(): count=',count);
          this.clientService.getClientByIndex(userAddress, i)
            .then(client => {
              //let myClient: ClientListItem = { clientID: client.clientID, name: client.name};
              console.log('ClientListComponent.loadClients(): client=',client);
              this.dataSource.addData(client);
              this.dataSource.sort.sortChange.next(); // THIS MAKES THE PAGE REFRESH.  If it is not here, then the user has to click on the header.  I am sure there is a better way to do this, but I don't know it.
              console.log('ClientListComponent.loadClient(): data=', this.dataSource.data)
            })
            .catch(err => {
              console.log('ClientListComponent.loadClients(): getClient() failed with err=', err);
            });
        }
      })
      .catch(err => {
        console.log('ClientListComponent.loadClients(): getClientCount() failed with err=', err);
      });
  }
}
