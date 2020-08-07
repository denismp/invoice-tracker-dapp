import { Injectable } from '@angular/core';
import { ClientListItem } from '../client-list/client-list-item.interface';
import { Web3ClientsService } from './web3-clients.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  success: boolean = false;

   //constructor(private http: HttpClient) { }
   constructor(private web3ClientsService: Web3ClientsService, private userService: UserService) { }

   public async createClient(userAddress: string, clientID: string, clientName: string): Promise<any> {
     console.log("ClientService.createClient(): DEBUG");
     try {
       //let owner: string = await this.web3ClientsService.contract.methods.getCurrentOwner().call();
       //let owner: string = "0x81E0ABF825FA3DF39E2EF2B063504C344B9702D3A".toUpperCase();
       let owner: string = this.web3ClientsService.owner;
       this.success = true;
       const pwd = this.userService.pwd;
       return await this.web3ClientsService.contract.methods.addClient(userAddress, pwd, clientID, clientName).send({ from: owner, gas: 3000000 });
     } catch (err) {
       this.success = false;
       console.log('ClientServiceService.createClient(): failed:', err);
       alert('ClientServiceService.createClient(): failed:' + err);
       return err;
     }
   }

   public async getClientCount(userAddress: string): Promise<number> {
     try {
       //let owner: string = await this.web3ClientsService.contract.methods.getCurrentOwner().call();
       let owner: string = this.web3ClientsService.owner;
       // The userAddress, most likely should be the owner, but I don't think it matters on a call().
       return await this.web3ClientsService.contract.methods.getClientCount(userAddress).call({ from: userAddress, gas: 3000000 });
     } catch (err) {
       console.log('ClientServiceService.getClientCount(): failed:', err);
       alert('ClientServiceService.getClientCount(): failed:' + err);
     }
   }

   public async getClientByIndex(userAddress: string, index: number): Promise<ClientListItem> {
     try {
       //let owner: string = await this.web3ClientsService.contract.methods.getCurrentOwner().call();
       let owner: string = this.web3ClientsService.owner;
       const pwd = this.userService.pwd;
       // The userAddress, most likely should be the owner, but I don't think it matters on a call().
       return await this.web3ClientsService.contract.methods.getClientByIndex(userAddress, pwd, index).call({ from: userAddress, gas: 3000000 });
     } catch (err) {
       console.log('ClientServiceService.getClientByIndex(): failed:', err);
       alert('ClientServiceService.getClientIndex(): failed:' + err);
     }
   }
}
