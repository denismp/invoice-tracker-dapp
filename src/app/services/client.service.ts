import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { ClientListItem } from '../client-list/client-list-item.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  success: boolean = false;

   //constructor(private http: HttpClient) { }
   constructor(private web3Service: Web3Service) { }

   public async createClient(userAddress: string, clientID: string, clientName: string): Promise<any> {
     console.log("ClientService.createClient(): DEBUG");
     try {
       //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
       //let owner: string = "0x81E0ABF825FA3DF39E2EF2B063504C344B9702D3A".toUpperCase();
       let owner: string = this.web3Service.owner;
       this.success = true;
       return await this.web3Service.contract.methods.addClient(userAddress, clientID, clientName).send({ from: owner, gas: 3000000 });
     } catch (err) {
       this.success = false;
       console.log('ClientServiceService.createClient(): failed:', err);
       alert('ClientServiceService.createClient(): failed:' + err);
       return err;
     }
   }

   public async getClientCount(userAddress: string): Promise<number> {
     try {
       //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
       let owner: string = this.web3Service.owner;
       return await this.web3Service.contract.methods.getClientCount(userAddress).call({ from: userAddress, gas: 3000000 });
     } catch (err) {
       console.log('ClientServiceService.getClientCount(): failed:', err);
       alert('ClientServiceService.getClientCount(): failed:' + err);
     }
   }

   public async getClientByIndex(userAddress: string, index: number): Promise<ClientListItem> {
     try {
       //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
       let owner: string = this.web3Service.owner;
       return await this.web3Service.contract.methods.getClientByIndex(userAddress, index).call({ from: userAddress, gas: 3000000 });
     } catch (err) {
       console.log('ClientServiceService.getClientByIndex(): failed:', err);
       alert('ClientServiceService.getClientIndex(): failed:' + err);
     }
   }
}
